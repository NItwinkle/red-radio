"""Build the disease index from the five supplied, unchanged workbooks."""
import json
import re
from collections import defaultdict
from pathlib import Path

import openpyxl


BASE = Path(r"D:\Download\xwechat_files\wxid_e2vrx9ffo15a22_e8b6\msg\file\2026-10")
ROOT = Path(__file__).parent
BOOKS = [BASE / f"第{name}本教材_全量候选标注_人工复核版(1).xlsx" for name in "一二三四五"]
CURATED_POINT_NAMES = set("大椎 风池 合谷 曲池 足三里 三阴交 太冲 肺俞 脾俞 肾俞 心俞 中脘 天枢 内关 外关 列缺 太溪 涌泉 百会 印堂 迎香 膻中 中府 关元 气海 神阙 命门 委中 阳陵泉 阴陵泉 血海 丰隆 太渊 尺泽 少商 商阳 肩井 肩髃 肩贞 风门 身柱 肝俞 胃俞 大肠俞 小肠俞 颊车 地仓 水沟 劳宫 神门 阳池 上巨虚 下巨虚 解溪 内庭 申脉 照海 昆仑 后溪 公孙 行间 阿是穴 足临泣 悬钟 支沟 大陵 天突 定喘 膈俞 膏肓 膀胱俞 胆俞 心包俞 太阳 人中 大杼 四渎 附分 志室 曲泽 期门 间使 夹脊 气舍 水分 建里 梁门 廉泉 秩边 环跳 落枕穴 耳尖 肩外俞 肩中俞 天柱 阳溪 偏历 臂臑 承山 承泣 四白 头维 翳风".split())


def rows(sheet):
    items = sheet.iter_rows(values_only=True)
    headers = next(items)
    return (dict(zip(headers, values)) for values in items)


def clean(value):
    return re.sub(r"[ \t]+", " ", str(value or "")).strip()


def symptom_terms(values):
    return list(dict.fromkeys(re.sub(r"^若(?=[\u4e00-\u9fff])", "", clean(value)) for value in values if clean(value)))


def source_sections(text, name):
    matches = list(re.finditer(r"【([^】]+)】|\[([^\]]+)\]", text))
    result = []
    for i, match in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        title = (match.group(1) or match.group(2)).strip()
        body = clean(text[match.end():end])
        if body:
            result.append({"title": title, "body": body})
    if not result:
        result.append({"title": "知识内容", "body": clean(text)})
    elif clean(text[:matches[0].start()]):
        intro = clean(text[:matches[0].start()])
        if intro not in (name, f"病名：{name}", f"病名:{name}"):
            result.insert(0, {"title": "概述", "body": intro})
    return result


def label_map(workbook):
    diseases = {}
    annotations = defaultdict(lambda: defaultdict(lambda: {"symptoms": [], "syndromes": []}))
    for name in ("Candidate_Entities", "Gold_Entities"):
        for entity in rows(workbook[name]):
            pid = entity.get("paragraph_id")
            typ = entity.get("entity_type")
            if typ == "DISEASE" and entity.get("value_raw"):
                diseases[pid] = clean(entity["value_raw"])
            scope = clean(entity.get("scope_hint_raw"))
            if not scope:
                if typ == "SYNDROME" and entity.get("value_raw"):
                    annotations[pid]["_"]["syndromes"].append(clean(entity["value_raw"]))
                continue
            if typ in ("SYMPTOM", "TONGUE_SIGN", "PULSE_SIGN") and entity.get("value_raw"):
                annotations[pid][scope]["symptoms"].append(clean(entity["value_raw"]))
            if typ == "SYNDROME" and entity.get("value_raw"):
                annotations[pid][scope]["syndromes"].append(clean(entity["value_raw"]))
    return diseases, annotations


def relation_map(workbook):
    entities = {}
    relations = defaultdict(list)
    for sheet_name in ("Candidate_Entities", "Gold_Entities"):
        for entity in rows(workbook[sheet_name]):
            if entity.get("entity_id"):
                entities[entity["entity_id"]] = entity
    for sheet_name in ("Candidate_Relations", "Gold_Relations"):
        for relation in rows(workbook[sheet_name]):
            if relation.get("paragraph_id"):
                relations[relation["paragraph_id"]].append(relation)
    return entities, relations


def related_values(pid, predicate, label, entities, relations, include_all=False, scoped_only=False):
    values = []
    for relation in relations[pid]:
        if relation.get("predicate") != predicate:
            continue
        scope = clean(relation.get("scope_raw"))
        if scoped_only and not scope:
            continue
        if not include_all and scope and not scope_matches(scope, label):
            continue
        entity = entities.get(relation.get("object_id"), {})
        value = clean(entity.get("value_raw"))
        if value and value not in values:
            values.append(value)
    return values


def scope_matches(scope, label):
    return bool(label) and (scope == label or len(label) >= 4 and label in scope or
                            label == "痰湿或痰热蕴肺" and "痰湿蕴肺" in scope)


def treatment_scopes(pid, relations):
    scopes = []
    for relation in relations[pid]:
        if relation.get("predicate") not in ("USES_ACUPOINT", "USES_TECHNIQUE", "APPLIED_TO_PATH"):
            continue
        scope = clean(relation.get("scope_raw"))
        if scope and scope not in scopes:
            scopes.append(scope)
    return scopes


def section_body(parts, title):
    return next((part["body"] for part in parts if part["title"] == title), "")


def split_treatment(parts, label, labels):
    treatment = section_body(parts, "刮治部位及方法")
    if not treatment:
        return parts
    if label.startswith("第") and label.endswith("支痛"):
        pattern = re.compile(r"三叉神经第\s*([ⅠⅡⅢ])\s*支痛\s*[:：]")
        matches = list(pattern.finditer(treatment))
        match = next((m for m in matches if f"第{m.group(1)}支痛" == label), None)
    else:
        pattern = re.compile("|".join(re.escape(value) + r"\s*[:：]" for value in labels))
        matches = list(pattern.finditer(treatment))
        match = next((m for m in matches if m.group().split("：")[0].split(":")[0].strip() == label), None)
    if not match:
        return parts
    following = next((m.start() for m in matches if m.start() > match.start()), len(treatment))
    body = clean(treatment[match.end():following])
    return [{**part, "body": body} if part["title"] == "刮治部位及方法" else part for part in parts]


def scoped_intro_symptom(parts, label):
    intro = section_body(parts, "概述") or section_body(parts, "概 述")
    if not intro:
        return ""
    match = re.search(r"(?:^|[。；;\n])\s*" + re.escape(label) + r"(?:主要表现为|表现为|则)\s*([^。；;]{4,100})", intro)
    return clean(match.group(1)) if match else ""


def structured_fields(pid, label, parts, entities, relations, multi=False):
    symptoms = related_values(pid, "HAS_SYMPTOM", label, entities, relations, include_all=not multi)
    if multi:
        symptoms = related_values(pid, "HAS_SYMPTOM", label, entities, relations, scoped_only=True)
        # Unscoped symptoms are usually disease-wide, not subtype-specific.
        if not any(scope_matches(clean(r.get("scope_raw")), label) and r.get("predicate") == "HAS_SYMPTOM" for r in relations[pid]):
            symptoms = []
    added = []
    if symptoms and not any(part["title"] in ("分型症状", "辨证分型") for part in parts):
        added.append({"title": "症状要点", "body": "、".join(symptom_terms(symptoms)) + "。"})
    return added + parts


def bronchitis_symptoms(pid, label, parts, entities, relations):
    intro = section_body(parts, "概述")
    if label == "急性期":
        match = re.search(r"急性者起病(.+?)(?=慢性者多发)", intro)
    elif label == "慢性期":
        match = re.search(r"慢性者多发(.+?)(?=本病归属于)", intro)
    else:
        return []
    if not match:
        return []
    passage = match.group(0)
    values = []
    if label == "急性期":
        onset = re.search(r"如([^，。]+)等", passage)
        if onset:
            values.extend(re.split(r"[、，]", onset.group(1)))
    related = related_values(pid, "HAS_SYMPTOM", "", entities, relations)
    values.extend(value for value in related if value in passage and value != "在晚期")
    values = [value for value in dict.fromkeys(values) if value and not any(value != other and value in other for other in values)]
    return values


def fever_syndrome_symptoms(intro, label):
    match = re.search(re.escape(label) + r"，([^。]+)", intro)
    if not match:
        return []
    passage = match.group(1).replace("多伴", "")
    return [part for part in re.split(r"[，、]", passage) if part]


def fields_for(book_number, text, name):
    if book_number == 2:
        sections = source_sections(text, name)
        # In this book the disease introduction precedes the first marked section.
        return [part for part in sections if part["title"] != "概述" or len(part["body"]) > 12]
    return source_sections(text, name)


# The final symptom chapter's DISEASE spans sometimes capture the opening sentence
# instead of the condition heading. These names are supported by the chapter text.
SYMPTOM_CHAPTER_NAMES = {
    "RAW000631": "发热", "RAW000632": "咳嗽", "RAW000633": "咽喉肿痛",
    "RAW000634": "自汗、盗汗", "RAW000635": "恶心、呕吐",
    "RAW000636": "腹痛", "RAW000637": "腹泻", "RAW000638": "头痛",
    "RAW000639": "头痛", "RAW000640": "头痛", "RAW000641": "头痛",
    "RAW000642": "眩晕",
}


def short_summary(parts):
    for part in parts:
        if part["title"] in ("分型症状", "症状要点", "辨证分型", "常见症状", "概述", "概 述"):
            return part["body"][:82].replace("\n", " ")
    return parts[0]["body"][:82].replace("\n", " ") if parts else ""


output = []
sample_count = 0
point_names = set()
for book_number, path in enumerate(BOOKS, 1):
    workbook = openpyxl.load_workbook(path, data_only=True)
    disease_names, annotations = label_map(workbook)
    entities, relations = relation_map(workbook)
    for entity in entities.values():
        if entity.get("entity_type") == "ACUPOINT":
            point = clean(entity.get("value_raw"))
            if point in CURATED_POINT_NAMES:
                point_names.add(point)
    grouped = {}
    for sample in rows(workbook["Samples"]):
        pid = sample["paragraph_id"]
        name = SYMPTOM_CHAPTER_NAMES.get(pid) if book_number == 5 else None
        name = name or disease_names.get(pid)
        if book_number == 2 and name == "慢性胃炎一般":
            name = "慢性胃炎"
        if not name:
            raise ValueError(f"No DISEASE entity for book {book_number}, {pid}")
        text = clean(sample.get("original_text"))
        parts = fields_for(book_number, text, name)
        item = grouped.setdefault(name, {"id": f"b{book_number}-{len(grouped)+1}", "name": name, "book": book_number, "variants": []})
        scopes = [scope for scope in annotations[pid] if scope != "_" and len(scope) <= 16 and not re.search(r"[，。；：\n]", scope)]
        labels = list(dict.fromkeys(scopes or annotations[pid]["_"]["syndromes"]))
        if book_number == 1:
            # This workbook has one syndrome-specific plan per row.
            if len(labels) != 1:
                raise ValueError(f"Ambiguous first-book label: {pid}: {labels}")
            label = labels[0]
            symptoms = related_values(pid, "HAS_SYMPTOM", label, entities, relations)
            if name == "高热" and label == "实热证":
                diagnosis = section_body(parts, "辨证分型")
                match = re.search(r"高热患者(.+?)，?多为实热证", diagnosis)
                if match:
                    symptoms = [part for part in match.group(1).rstrip("，").split("，") if part]
            if symptoms:
                parts = [{"title": "分型症状", "body": "、".join(symptom_terms(symptoms)) + "。"}] + [part for part in parts if part["title"] != "辨证分型"]
            variant = {"label": label, "fields": structured_fields(pid, label, parts, entities, relations)}
        elif book_number == 2:
            labels = treatment_scopes(pid, relations)
            if name == "三叉神经痛":
                labels = [f"第{number}支痛" for number in re.findall(r"三叉神经第\s*([ⅠⅡⅢ])\s*支痛\s*[:：]", section_body(parts, "刮治部位及方法"))]
            labels = list(dict.fromkeys(labels))
            if labels:
                for label in labels:
                    scoped = split_treatment(parts, label, labels)
                    if name == "支气管炎":
                        symptoms = bronchitis_symptoms(pid, label, parts, entities, relations)
                        if symptoms:
                            scoped = [{"title": "分型症状", "body": "、".join(symptoms) + "。"}] + scoped
                    scoped = structured_fields(pid, label, scoped, entities, relations, multi=len(labels) > 1)
                    symptom = scoped_intro_symptom(parts, label)
                    if symptom and not any(field["title"] in ("症状要点", "分型症状") for field in scoped):
                        scoped.insert(0, {"title": "分型症状", "body": symptom + "。"})
                    item["variants"].append({"label": label, "fields": scoped})
                sample_count += 1
                continue
            variant = {"label": "", "fields": structured_fields(pid, "", parts, entities, relations)}
        elif book_number == 3 and name == "高热":
            intro = section_body(parts, "概述")
            treatment = section_body(parts, "刮拭取穴")
            common_treatment = treatment.split("；内伤发热：", 1)[0]
            for label in ("外感发热", "内伤发热"):
                symptoms = fever_syndrome_symptoms(intro, label)
                scoped = [{"title": "分型症状", "body": "、".join(symptoms) + "。"}]
                for part in parts:
                    if part["title"] == "刮拭取穴":
                        body = common_treatment if label == "外感发热" else treatment
                        scoped.append({**part, "body": body})
                    else:
                        scoped.append(part)
                item["variants"].append({"label": label, "fields": structured_fields(pid, label, scoped, entities, relations, multi=True)})
            sample_count += 1
            continue
        elif book_number == 4 and len(labels) > 1:
            diagnosis = next((part["body"] for part in parts if part["title"] == "辨证分型"), "")
            treatment = next((part["body"] for part in parts if part["title"] == "刮痧治疗"), "")
            chunks = re.split(r"(?=（[一二三四五六七八九十]+）[^\n]+)", treatment)
            chunks = [chunk.strip() for chunk in chunks if chunk.strip()]
            other = [part for part in parts if part["title"] not in ("辨证分型", "刮痧治疗")]
            for index, label in enumerate(labels):
                symptoms = annotations[pid].get(label, {}).get("symptoms", [])
                scoped = []
                if symptoms:
                    scoped.append({"title": "分型症状", "body": "、".join(symptom_terms(symptoms)) + "。"})
                elif diagnosis:
                    scoped.append({"title": "辨证分型", "body": diagnosis})
                if len(chunks) == len(labels):
                    scoped.append({"title": "刮痧治疗", "body": chunks[index]})
                elif treatment:
                    scoped.append({"title": "刮痧治疗", "body": treatment})
                scoped.extend(other)
                scoped = structured_fields(pid, label, scoped, entities, relations, multi=True)
                item["variants"].append({"label": label, "fields": scoped})
            sample_count += 1
            continue
        elif book_number == 5 and name == "头痛":
            treatment = section_body(parts, "刮痧治疗")
            match = re.search(r"\n([^\n]{2,8}痛)\n取穴\s*[:：]", treatment)
            label = match.group(1) if match else ""
            variant = {"label": label, "fields": structured_fields(pid, label, parts, entities, relations)}
        else:
            label = labels[0] if len(labels) == 1 else ""
            variant = {"label": label, "fields": structured_fields(pid, label, parts, entities, relations)}
        item["variants"].append(variant)
        sample_count += 1
    for item in grouped.values():
        unique = []
        seen = set()
        for variant in item["variants"]:
            signature = (variant["label"], tuple((field["title"], field["body"]) for field in variant["fields"]))
            if signature not in seen:
                unique.append(variant)
                seen.add(signature)
        item["variants"] = unique
        if len(unique) > 1 and any(not variant["label"] for variant in unique):
            raise ValueError(f"Unlabeled multiple knowledge records: {book_number}, {item['name']}")
        item["summary"] = short_summary(item["variants"][0]["fields"])
        output.append(item)

target = ROOT / "dist" / "data.js"
target.write_text("window.DISEASES = " + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
point_target = ROOT / "dist" / "point-names.js"
point_target.write_text("window.POINT_NAMES = " + json.dumps(sorted(point_names, key=lambda name: (-len(name), name)), ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
print(json.dumps({"samples": sample_count, "entries": len(output), "by_book": {str(i): sum(d["book"] == i for d in output) for i in range(1, 6)}, "unique_names": len({d["name"] for d in output})}, ensure_ascii=False))
