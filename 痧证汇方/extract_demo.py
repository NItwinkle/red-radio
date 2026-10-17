import json
import re
from pathlib import Path

import openpyxl


SOURCE = Path(r"D:\Download\xwechat_files\wxid_e2vrx9ffo15a22_e8b6\msg\file\2026-10\第一本教材_全量候选标注_人工复核版(1).xlsx")
OUTPUT = Path(__file__).parent / "dist" / "data.js"
TARGETS = ["感冒", "高热", "中暑", "咳嗽", "哮喘"]
SECTION_NAMES = ["辨证分型", "治法", "处方与操作", "方义", "注意事项"]


def split_sections(text: str) -> dict:
    disease_match = re.search(r"病名[：:]\s*([^\s【]+)", text)
    disease = disease_match.group(1).strip() if disease_match else "未命名"
    markers = list(re.finditer(r"【([^】]+)】", text))
    sections = {}
    for index, marker in enumerate(markers):
        key = marker.group(1).strip()
        start = marker.end()
        end = markers[index + 1].start() if index + 1 < len(markers) else len(text)
        sections[key] = re.sub(r"\s+", " ", text[start:end]).strip()
    return {"disease": disease, **{name: sections.get(name, "") for name in SECTION_NAMES}}


workbook = openpyxl.load_workbook(SOURCE, read_only=False, data_only=True)
sheet = workbook["Samples"]
entity_maps = {}
for sheet_name in ["Gold_Entities", "Candidate_Entities"]:
    entity_sheet = workbook[sheet_name]
    headers = [cell.value for cell in entity_sheet[1]]
    mapping = {}
    for values in entity_sheet.iter_rows(min_row=2, values_only=True):
        entity = dict(zip(headers, values))
        if entity.get("section") != "辨证分型":
            continue
        key = (entity.get("disease_raw"), entity.get("paragraph_id"))
        entry = mapping.setdefault(key, {"scopes": [], "syndromes": [], "symptoms": []})
        scope = entity.get("scope_hint_raw")
        if scope and scope not in entry["scopes"]:
            entry["scopes"].append(scope)
        value = entity.get("value_raw")
        if entity.get("entity_type") == "SYNDROME" and value:
            entry["syndromes"].append(value)
        if entity.get("entity_type") in ["SYMPTOM", "TONGUE_SIGN", "PULSE_SIGN"] and value:
            entry["symptoms"].append(value)
    entity_maps[sheet_name] = mapping
grouped = {name: [] for name in TARGETS}
pages = {name: set() for name in TARGETS}

for row in sheet.iter_rows(min_row=2, values_only=True):
    text = row[5] or ""
    parsed = split_sections(text)
    name = parsed["disease"]
    if name not in grouped:
        continue
    parsed["page"] = row[3] or row[4] or ""
    parsed["paragraphId"] = row[0]
    key = (name, row[0])
    entry = entity_maps["Gold_Entities"].get(key) or entity_maps["Candidate_Entities"].get(key)
    if not entry:
        raise ValueError(f"Missing entity annotations: {key}")
    labels = entry["scopes"] or entry["syndromes"]
    if len(set(labels)) != 1:
        raise ValueError(f"Ambiguous syndrome: {key}: {labels}")
    parsed["syndrome"] = labels[0]
    parsed["syndromeSource"] = "Gold_Entities" if key in entity_maps["Gold_Entities"] else "Candidate_Entities"
    # Preserve the source's exact syndrome-specific passage, excluding shared introductions.
    diagnostic = parsed["辨证分型"]
    if "若" in diagnostic:
        diagnostic = "若" + diagnostic.rsplit("若", 1)[1]
    elif name == "哮喘":
        marker = "发作期表现为" if parsed["syndrome"] in ["寒哮", "热哮"] else "缓解期表现为"
        if marker in diagnostic:
            diagnostic = diagnostic.split(marker, 1)[1]
    if entry["symptoms"]:
        diagnostic = "、".join(dict.fromkeys(entry["symptoms"])) + "。"
    parsed["辨证分型"] = diagnostic
    grouped[name].append(parsed)
    pages[name].add(str(parsed["page"]))

data = []
for idx, name in enumerate(TARGETS, start=1):
    variants = grouped[name]
    symptoms = []
    for item in variants:
        symptom_text = re.sub(r"^若|^患者", "", item["辨证分型"])
        symptom_text = re.sub(r"，?为[^。]+。?$", "", symptom_text)
        symptoms.extend([part.strip(" ，。；") for part in re.split(r"[，；。]", symptom_text) if 1 < len(part.strip()) < 16])
    data.append({
        "id": f"disease-{idx}",
        "name": name,
        "summary": "、".join(item["syndrome"] for item in variants),
        "symptomKeywords": list(dict.fromkeys(symptoms))[:12],
        "pages": "、".join(sorted(pages[name])),
        "source": "第一本教材",
        "variants": variants,
    })

OUTPUT.write_text("window.DISEASES = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"wrote {OUTPUT} with {len(data)} diseases and {sum(len(x['variants']) for x in data)} variants")
