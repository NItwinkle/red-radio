/* Additional reading tools. The atlas is schematic, not a clinical locator. */
window.SITE_FEATURES = (() => {
  const pointSources = {
    face: 'https://zyj.beijing.gov.cn/sy/whkp/202610/t20261009_4894131.html',
    hand: 'https://zyj.beijing.gov.cn/sy/whkp/202610/t20261009_4894137.html',
    neck: 'https://zyj.beijing.gov.cn/sy/whkp/202601/t20260119_4445295.html',
    back: 'https://ws.zibo.gov.cn/art/2022/11/8/art_812_2340269.html',
    leg: 'https://zyj.beijing.gov.cn/sy/whkp/202102/t20210201_2250651.html',
    wrist: 'https://zyj.beijing.gov.cn/sy/whkp/202107/t20210727_2449378.html'
  };
  const locationStandard = 'https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=397548AE7248D3D87DD15E0AB8107185&refer=outter';
  const atlasPoints = [
    /* ── 督脉（后正中线，从头向后下） ── */
    {name:'百会', part:'头部', meridian:'督脉', pos:[0.50,0.985,0.56], location:'头顶正中线与两耳尖连线的交点处。', uses:'传统用于头昏、头痛及神志类不适。', note:'头皮部位，刮拭宜轻柔，勿过度用力。', source:pointSources.face},
    {name:'四神聪', part:'头部', meridian:'经外奇穴', pos:[0.50,0.98,0.56], location:'百会穴前、后、左、右各旁开约1寸处。', uses:'传统用于头昏、失眠等。', note:'头顶皮薄，宜轻柔。', source:pointSources.face},
    {name:'风府', part:'头部', meridian:'督脉', pos:[0.50,0.80,0.35], location:'后发际正中直上约1寸，枕外隆凸下方凹陷处。', uses:'传统用于头痛、项强。', note:'后颈中央，操作宜轻柔。', source:pointSources.neck},
    {name:'哑门', part:'头部', meridian:'督脉', pos:[0.50,0.775,0.35], location:'后发际正中直上约0.5寸。', uses:'传统用于项强等不适。', note:'颈上段近延髓，仅示意位置，不做重刺激。', source:pointSources.neck},
    {name:'大椎', part:'颈背', meridian:'督脉', pos:[0.50,0.795,0.37], location:'第七颈椎棘突下方的凹陷处。', uses:'传统用于外感发热、头项不适等。', note:'颈后骨突附近应轻柔，具体刮治路线以病证方案为准。', source:pointSources.neck},
    {name:'至阳', part:'腰背', meridian:'督脉', pos:[0.50,0.675,0.35], location:'背部后正中线，约平第7胸椎棘突下。', uses:'传统用于背痛、胸闷。', note:'背部依方案单向处理。', source:pointSources.back},
    {name:'命门', part:'腰背', meridian:'督脉', pos:[0.50,0.615,0.36], location:'腰部后正中线，约平第2腰椎棘突下。', uses:'传统用于腰膝酸软等。', note:'腰部刮拭方向宜单向向下，勿在腰背破损处刮拭。', source:pointSources.back},
    {name:'腰阳关', part:'腰背', meridian:'督脉', pos:[0.50,0.58,0.36], location:'腰部后正中线，约平第4腰椎棘突下。', uses:'传统用于腰痛、下肢不适。', note:'腰骶部宜轻柔单向操作。', source:pointSources.back},
    /* ── 任脉（前正中线，从下向上） ── */
    {name:'天突', part:'颈背', meridian:'任脉', pos:[0.50,0.80,0.615], location:'胸骨上窝中央凹陷处。', uses:'传统用于咳喘、咽部不适。', note:'颈部敏感，仅示意位置，避免重压。', source:pointSources.neck},
    {name:'膻中', part:'胸腹', meridian:'任脉', pos:[0.50,0.745,0.62], location:'胸前正中线，平第4肋间隙处。', uses:'传统用于胸闷、气短、心悸等。', note:'胸前皮肤较薄，刮拭宜轻柔。', source:pointSources.face},
    {name:'鸠尾', part:'胸腹', meridian:'任脉', pos:[0.50,0.705,0.60], location:'上腹部前正中线，剑突下缘凹陷处。', uses:'传统用于胸闷、胃部不适。', note:'近剑突，操作宜轻。', source:pointSources.face},
    {name:'中脘', part:'胸腹', meridian:'任脉', pos:[0.50,0.665,0.60], location:'上腹部前正中线，脐上约4寸。', uses:'传统用于胃胀、食欲不振等脾胃不适。', note:'腹部刮拭应缓而轻，饭后不宜立即进行。', source:pointSources.face},
    {name:'神阙', part:'胸腹', meridian:'任脉', pos:[0.50,0.63,0.60], location:'肚脐中央。', uses:'传统用于腹痛、泄泻等。', note:'脐周皮肤薄，操作宜轻柔，勿用力按压。', source:pointSources.face},
    {name:'气海', part:'胸腹', meridian:'任脉', pos:[0.50,0.60,0.60], location:'下腹部前正中线，脐下约1.5寸。', uses:'传统用于气虚、腹痛等。', note:'腹部敏感，力度宜轻。', source:pointSources.face},
    {name:'关元', part:'胸腹', meridian:'任脉', pos:[0.50,0.575,0.60], location:'下腹部前正中线，脐下约3寸。', uses:'传统用于虚劳、小便不利等。', note:'腹部操作宜轻，特殊人群先咨询医师。', source:pointSources.face},
    /* ── 手太阴肺经（胸→上肢内→拇指） ── */
    {name:'中府', part:'胸腹', meridian:'手太阴肺经', pos:[0.47,0.78,0.57], location:'胸前壁外上方，锁骨下缘旁开约6寸处。', uses:'传统用于咳嗽、胸闷。', note:'胸前宜轻柔。', source:pointSources.face},
    {name:'尺泽', part:'上肢', meridian:'手太阴肺经', pos:[0.435,0.535,0.61], location:'肘横纹中，肱二头肌腱桡侧凹陷处。', uses:'传统用于咳喘、肘臂不适。', note:'肘窝操作宜轻。', source:pointSources.hand},
    {name:'孔最', part:'上肢', meridian:'手太阴肺经', pos:[0.44,0.47,0.605], location:'前臂掌面桡侧，腕横纹上约7寸。', uses:'传统用于咳嗽、咯血。', note:'前臂可依方案操作。', source:pointSources.wrist},
    {name:'列缺', part:'上肢', meridian:'手太阴肺经', pos:[0.445,0.43,0.60], location:'桡骨茎突上方，腕横纹上约1.5寸。', uses:'传统用于头项、咳嗽等不适。', note:'腕部宜轻柔。', source:pointSources.wrist},
    {name:'太渊', part:'上肢', meridian:'手太阴肺经', pos:[0.45,0.415,0.60], location:'腕横纹桡侧端，桡动脉搏动处。', uses:'传统用于咳嗽、气喘。', note:'近动脉，避免重压。', source:pointSources.wrist},
    {name:'鱼际', part:'上肢', meridian:'手太阴肺经', pos:[0.45,0.39,0.59], location:'第1掌骨中点桡侧，赤白肉际处。', uses:'传统用于咳嗽、咽痛。', note:'手掌操作宜轻柔。', source:pointSources.hand},
    {name:'少商', part:'上肢', meridian:'手太阴肺经', pos:[0.46,0.36,0.585], location:'拇指桡侧指甲角旁约0.1寸。', uses:'传统用于咽痛、咳嗽。', note:'指端面积小，操作轻柔。', source:pointSources.hand},
    /* ── 手阳明大肠经（食指→肩→面） ── */
    {name:'商阳', part:'上肢', meridian:'手阳明大肠经', pos:[0.46,0.36,0.60], location:'食指桡侧指甲角旁约0.1寸。', uses:'传统用于咽痛、热病。', note:'指端操作轻柔。', source:pointSources.hand},
    {name:'合谷', part:'上肢', meridian:'手阳明大肠经', pos:[0.445,0.36,0.59], location:'手背第1、2掌骨之间，约平第2掌骨桡侧中点。', uses:'传统用于鼻部及头面部不适。', note:'手背面积小，避免破损皮肤；孕期不宜自行刺激此穴。', source:pointSources.hand},
    {name:'阳溪', part:'上肢', meridian:'手阳明大肠经', pos:[0.44,0.415,0.585], location:'腕背横纹桡侧，两筋之间凹陷处。', uses:'传统用于腕臂不适。', note:'腕部宜轻柔。', source:pointSources.wrist},
    {name:'手三里', part:'上肢', meridian:'手阳明大肠经', pos:[0.435,0.50,0.58], location:'曲池穴下约2寸，桡骨外侧。', uses:'传统用于肘臂、胃肠不适。', note:'前臂可依方案操作。', source:pointSources.hand},
    {name:'曲池', part:'上肢', meridian:'手阳明大肠经', pos:[0.44,0.52,0.58], location:'屈肘时，肘横纹外侧端凹陷处。', uses:'传统用于肘臂不适、外感等。', note:'肘部骨突附近轻柔操作。', source:pointSources.hand},
    {name:'肩髃', part:'上肢', meridian:'手阳明大肠经', pos:[0.42,0.765,0.52], location:'三角肌上部，肩峰前下方凹陷处。', uses:'传统用于肩臂不举。', note:'肩部可依方案操作。', source:pointSources.hand},
    {name:'迎香', part:'头部', meridian:'手阳明大肠经', pos:[0.545,0.885,0.61], location:'鼻翼外缘中点旁，鼻唇沟中。', uses:'传统用于鼻塞、嗅觉减退等鼻部不适。', note:'靠近鼻部，仅示意位置；具体处理应由专业人员判断。', source:pointSources.face},
    /* ── 足阳明胃经（面→胸腹→下肢前→足） ── */
    {name:'承泣', part:'头部', meridian:'足阳明胃经', pos:[0.545,0.90,0.60], location:'目正视，瞳孔直下眶下缘处。', uses:'传统用于目部不适。', note:'眼周皮肤极敏感，仅示意，避免触碰眼区。', source:pointSources.face},
    {name:'四白', part:'头部', meridian:'足阳明胃经', pos:[0.545,0.885,0.60], location:'目正视，瞳孔直下眶下孔处。', uses:'传统用于目部、面部不适。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'地仓', part:'头部', meridian:'足阳明胃经', pos:[0.54,0.87,0.615], location:'口角外侧约0.4寸。', uses:'传统用于口面不适。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'颊车', part:'头部', meridian:'足阳明胃经', pos:[0.52,0.855,0.55], location:'下颌角前上方约一横指凹陷处。', uses:'传统用于牙痛、面颊不适。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'下关', part:'头部', meridian:'足阳明胃经', pos:[0.53,0.875,0.50], location:'颧弓下缘，下颌切迹凹陷处。', uses:'传统用于牙痛、耳部不适。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'天枢', part:'胸腹', meridian:'足阳明胃经', pos:[0.575,0.63,0.60], location:'腹部，脐旁约2寸。', uses:'传统用于腹胀、便秘等。', note:'腹部宜轻柔单向。', source:pointSources.face},
    {name:'足三里', part:'下肢', meridian:'足阳明胃经', pos:[0.575,0.22,0.60], location:'小腿外侧，犊鼻下约3寸，胫骨外侧约一横指。', uses:'传统用于腹胀、食欲不振等脾胃不适。', note:'在小腿外侧区域识别，不以图上的圆点作为精确操作位置。', source:pointSources.leg},
    {name:'上巨虚', part:'下肢', meridian:'足阳明胃经', pos:[0.575,0.175,0.60], location:'小腿外侧，足三里下约3寸。', uses:'传统用于肠腹不适。', note:'小腿可依方案操作。', source:pointSources.leg},
    {name:'下巨虚', part:'下肢', meridian:'足阳明胃经', pos:[0.575,0.13,0.60], location:'小腿外侧，上巨虚下约3寸。', uses:'传统用于下肢、肠腹不适。', note:'小腿可依方案操作。', source:pointSources.leg},
    {name:'解溪', part:'下肢', meridian:'足阳明胃经', pos:[0.575,0.08,0.595], location:'踝关节前横纹中央凹陷处。', uses:'传统用于下肢、头痛等不适。', note:'踝前皮肤薄，宜轻柔。', source:pointSources.leg},
    {name:'内庭', part:'下肢', meridian:'足阳明胃经', pos:[0.55,0.035,0.595], location:'足背第2、3趾间，趾蹼缘后方。', uses:'传统用于胃热、牙痛等。', note:'足背皮肤薄，宜轻柔。', source:pointSources.leg},
    /* ── 足太阴脾经（足→腿内→腹→胸） ── */
    {name:'隐白', part:'下肢', meridian:'足太阴脾经', pos:[0.51,0.03,0.55], location:'足大趾内侧指甲角旁约0.1寸。', uses:'传统用于便血、月经不调等。', note:'指端操作轻柔。', source:pointSources.leg},
    {name:'太白', part:'下肢', meridian:'足太阴脾经', pos:[0.52,0.035,0.545], location:'足内侧第1跖骨小头后下方凹陷处。', uses:'传统用于脾胃、下肢不适。', note:'足部宜轻柔。', source:pointSources.leg},
    {name:'三阴交', part:'下肢', meridian:'足太阴脾经', pos:[0.53,0.135,0.50], location:'内踝尖直上约3寸，胫骨内侧缘后方。', uses:'传统用于妇科、脾胃及睡眠不适。', note:'小腿内侧宜轻柔；孕期避免刺激。', source:pointSources.leg},
    {name:'阴陵泉', part:'下肢', meridian:'足太阴脾经', pos:[0.545,0.27,0.50], location:'小腿内侧，胫骨内侧髁下缘凹陷处。', uses:'传统用于腹胀、小便不利等。', note:'膝内侧宜轻柔。', source:pointSources.leg},
    {name:'血海', part:'下肢', meridian:'足太阴脾经', pos:[0.555,0.33,0.50], location:'大腿内侧，髌骨内上缘上约2寸。', uses:'传统用于血虚、皮肤及妇科不适。', note:'大腿内侧宜轻柔。', source:pointSources.leg},
    {name:'大横', part:'胸腹', meridian:'足太阴脾经', pos:[0.585,0.63,0.585], location:'腹部，脐旁约4寸。', uses:'传统用于腹胀、便秘等。', note:'腹部宜轻柔单向。', source:pointSources.face},
    {name:'周荣', part:'胸腹', meridian:'足太阴脾经', pos:[0.575,0.76,0.575], location:'胸前外侧，第2肋间隙处。', uses:'传统用于胸胁不适。', note:'胸前宜轻柔。', source:pointSources.face},
    /* ── 手少阴心经（腋→臂内→腕→小指） ── */
    {name:'极泉', part:'胸腹', meridian:'手少阴心经', pos:[0.47,0.76,0.53], location:'腋窝顶点，腋动脉搏动处。', uses:'传统用于上肢及心胸不适。', note:'腋窝敏感，仅示意位置，避免重压。', source:pointSources.hand},
    {name:'少海', part:'上肢', meridian:'手少阴心经', pos:[0.44,0.535,0.575], location:'屈肘时，肘横纹内侧端与肱骨内上髁之间。', uses:'传统用于肘臂、心胸不适。', note:'肘内侧宜轻柔。', source:pointSources.hand},
    {name:'通里', part:'上肢', meridian:'手少阴心经', pos:[0.445,0.43,0.575], location:'前臂掌侧尺侧，腕横纹上约1寸。', uses:'传统用于心悸、失眠。', note:'前臂宜轻柔。', source:pointSources.wrist},
    {name:'神门', part:'上肢', meridian:'手少阴心经', pos:[0.448,0.415,0.575], location:'腕横纹尺侧端，尺侧腕屈肌腱桡侧。', uses:'传统用于心悸、失眠等。', note:'腕部宜轻柔。', source:pointSources.wrist},
    /* ── 手太阳小肠经（小指→肩→面） ── */
    {name:'少泽', part:'上肢', meridian:'手太阳小肠经', pos:[0.46,0.36,0.575], location:'小指尺侧指甲角旁约0.1寸。', uses:'传统用于咽痛、乳痈等。', note:'指端操作轻柔。', source:pointSources.hand},
    {name:'后溪', part:'上肢', meridian:'手太阳小肠经', pos:[0.445,0.36,0.575], location:'握拳时，第5掌指关节后尺侧横纹头处。', uses:'传统用于颈项、腰痛。', note:'手掌操作轻柔。', source:pointSources.hand},
    {name:'小海', part:'上肢', meridian:'手太阳小肠经', pos:[0.435,0.53,0.55], location:'屈肘时，尺骨鹰嘴与肱骨内上髁之间凹陷处。', uses:'传统用于肘臂、颈项不适。', note:'肘内侧宜轻柔。', source:pointSources.hand},
    {name:'肩贞', part:'上肢', meridian:'手太阳小肠经', pos:[0.42,0.72,0.50], location:'肩关节后下方，腋后纹头上约1寸。', uses:'传统用于肩臂不举。', note:'肩后宜轻柔。', source:pointSources.hand},
    {name:'天宗', part:'颈背', meridian:'手太阳小肠经', pos:[0.44,0.70,0.42], location:'肩胛骨冈下窝中央凹陷处。', uses:'传统用于肩胛疼痛。', note:'肩胛区可依方案操作。', source:pointSources.back},
    {name:'颧髎', part:'头部', meridian:'手太阳小肠经', pos:[0.55,0.875,0.56], location:'目外眦直下，颧骨下缘凹陷处。', uses:'传统用于面颊、牙痛。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'听宫', part:'头部', meridian:'手太阳小肠经', pos:[0.53,0.875,0.50], location:'耳屏前，下颌骨髁状突后方凹陷处。', uses:'传统用于耳鸣、耳聋。', note:'耳前宜轻柔。', source:pointSources.face},
    /* ── 足太阳膀胱经（目内眦→背→腿后→足） ── */
    {name:'睛明', part:'头部', meridian:'足太阳膀胱经', pos:[0.55,0.895,0.60], location:'目内眦角稍上方凹陷处。', uses:'传统用于目部不适。', note:'眼区极敏感，仅示意，不触碰眼周。', source:pointSources.face},
    {name:'攒竹', part:'头部', meridian:'足太阳膀胱经', pos:[0.545,0.925,0.60], location:'眉头凹陷处。', uses:'传统用于头痛、眉棱骨痛。', note:'面部宜轻柔。', source:pointSources.face},
    {name:'肺俞', part:'颈背', meridian:'足太阳膀胱经', pos:[0.565,0.745,0.34], location:'背部第3胸椎棘突下，后正中线旁开约1.5寸。', uses:'传统用于咳嗽等肺系症状。', note:'背部可依方案分段单向处理；勿在皮肤破损处刮拭。', source:pointSources.back},
    {name:'心俞', part:'颈背', meridian:'足太阳膀胱经', pos:[0.565,0.715,0.33], location:'背部第5胸椎棘突下，后正中线旁开约1.5寸。', uses:'传统用于心悸、失眠等心神症状。', note:'背部刮拭沿膀胱经第一侧线单向进行。', source:pointSources.back},
    {name:'肝俞', part:'腰背', meridian:'足太阳膀胱经', pos:[0.565,0.67,0.34], location:'背部第9胸椎棘突下，后正中线旁开约1.5寸。', uses:'传统用于胁痛、目部不适。', note:'背部可依方案单向操作。', source:pointSources.back},
    {name:'脾俞', part:'腰背', meridian:'足太阳膀胱经', pos:[0.565,0.645,0.34], location:'背部第11胸椎棘突下，后正中线旁开约1.5寸。', uses:'传统用于脾胃、腹胀等不适。', note:'背部可依方案单向操作。', source:pointSources.back},
    {name:'肾俞', part:'腰背', meridian:'足太阳膀胱经', pos:[0.565,0.60,0.33], location:'腰部，第2腰椎棘突下旁开约1.5寸。', uses:'传统用于腰酸、耳鸣等。', note:'腰背皮肤可依方案处理，注意力度适中。', source:pointSources.back},
    {name:'委中', part:'下肢', meridian:'足太阳膀胱经', pos:[0.56,0.28,0.35], location:'膝后腘窝横纹中点处。', uses:'传统用于腰背不适、下肢不适。', note:'腘窝处血管神经较多，刮拭宜轻。', source:pointSources.leg},
    {name:'承山', part:'下肢', meridian:'足太阳膀胱经', pos:[0.56,0.18,0.36], location:'小腿后面正中，腓肠肌两肌腹之间凹陷处。', uses:'传统用于小腿转筋、腰痛。', note:'小腿后宜轻柔。', source:pointSources.leg},
    {name:'昆仑', part:'下肢', meridian:'足太阳膀胱经', pos:[0.55,0.08,0.40], location:'外踝尖与跟腱之间凹陷处。', uses:'传统用于腰腿、项痛。', note:'踝部宜轻柔。', source:pointSources.leg},
    {name:'至阴', part:'下肢', meridian:'足太阳膀胱经', pos:[0.50,0.035,0.50], location:'足小趾外侧指甲角旁约0.1寸。', uses:'传统用于胎位不正（须专业处理）、头痛。', note:'指端操作轻柔；孕期遵医嘱。', source:pointSources.leg},
    /* ── 足少阴肾经（足心→腿内→腹→胸） ── */
    {name:'涌泉', part:'下肢', meridian:'足少阴肾经', pos:[0.52,0.015,0.56], location:'足底前1/3凹陷处，蜷足时呈凹陷处。', uses:'传统用于头昏、失眠等。', note:'足底皮肤较厚，可按方案处理，注意操作卫生。', source:pointSources.leg},
    {name:'太溪', part:'下肢', meridian:'足少阴肾经', pos:[0.53,0.08,0.50], location:'内踝尖与跟腱之间凹陷处。', uses:'传统用于腰酸、耳鸣、失眠。', note:'踝部宜轻柔。', source:pointSources.leg},
    {name:'照海', part:'下肢', meridian:'足少阴肾经', pos:[0.53,0.075,0.505], location:'内踝尖下方凹陷处。', uses:'传统用于咽部、失眠等不适。', note:'踝部宜轻柔。', source:pointSources.leg},
    {name:'复溜', part:'下肢', meridian:'足少阴肾经', pos:[0.53,0.11,0.50], location:'小腿内侧，太溪穴上约2寸。', uses:'传统用于水肿、盗汗。', note:'小腿内侧宜轻柔。', source:pointSources.leg},
    {name:'阴谷', part:'下肢', meridian:'足少阴肾经', pos:[0.54,0.285,0.47], location:'腘横纹内侧端，半腱肌腱与半膜肌腱之间。', uses:'传统用于膝股、小便不利。', note:'膝内侧宜轻柔。', source:pointSources.leg},
    {name:'俞府', part:'胸腹', meridian:'足少阴肾经', pos:[0.57,0.79,0.57], location:'胸前，锁骨下缘前正中线旁开约2寸。', uses:'传统用于咳喘、胸痛。', note:'胸前宜轻柔。', source:pointSources.face},
    /* ── 手厥阴心包经（胸→臂内→腕→中指） ── */
    {name:'天池', part:'胸腹', meridian:'手厥阴心包经', pos:[0.47,0.76,0.575], location:'第4肋间隙，乳头外开约1寸。', uses:'传统用于胸闷、胁痛。', note:'胸前宜轻柔。', source:pointSources.face},
    {name:'曲泽', part:'上肢', meridian:'手厥阴心包经', pos:[0.44,0.535,0.585], location:'肘横纹中，肱二头肌腱尺侧凹陷处。', uses:'传统用于心悸、胃部不适。', note:'肘窝宜轻柔。', source:pointSources.hand},
    {name:'内关', part:'上肢', meridian:'手厥阴心包经', pos:[0.445,0.43,0.60], location:'前臂掌侧腕横纹上约2寸，两条肌腱之间。', uses:'传统用于胸闷、心悸、胃部不适、恶心等。', note:'腕部应轻柔，刮拭方向和力度须结合具体方案。', source:pointSources.wrist},
    {name:'大陵', part:'上肢', meridian:'手厥阴心包经', pos:[0.448,0.415,0.595], location:'腕横纹中央，两筋之间。', uses:'传统用于心悸、腕痛。', note:'腕部宜轻柔。', source:pointSources.wrist},
    {name:'劳宫', part:'上肢', meridian:'手厥阴心包经', pos:[0.45,0.375,0.585], location:'手掌心，第2、3掌骨之间偏第3掌骨处。', uses:'传统用于口疮、心烦。', note:'掌面宜轻柔。', source:pointSources.hand},
    {name:'中冲', part:'上肢', meridian:'手厥阴心包经', pos:[0.46,0.36,0.575], location:'中指尖端中央。', uses:'传统用于昏厥、心烦。', note:'指端操作轻柔。', source:pointSources.hand},
    /* ── 手少阳三焦经（无名指→肩→耳） ── */
    {name:'关冲', part:'上肢', meridian:'手少阳三焦经', pos:[0.46,0.36,0.57], location:'无名指尺侧指甲角旁约0.1寸。', uses:'传统用于咽痛、热病。', note:'指端操作轻柔。', source:pointSources.hand},
    {name:'中渚', part:'上肢', meridian:'手少阳三焦经', pos:[0.445,0.37,0.57], location:'手背第4、5掌骨间，掌指关节后方凹陷处。', uses:'传统用于耳鸣、头痛。', note:'手背宜轻柔。', source:pointSources.hand},
    {name:'外关', part:'上肢', meridian:'手少阳三焦经', pos:[0.44,0.43,0.57], location:'前臂背侧，腕背横纹上约2寸，两骨之间。', uses:'传统用于头痛、耳鸣、外感。', note:'前臂背侧宜轻柔。', source:pointSources.wrist},
    {name:'支沟', part:'上肢', meridian:'手少阳三焦经', pos:[0.44,0.44,0.57], location:'前臂背侧，腕背横纹上约3寸。', uses:'传统用于便秘、胁痛。', note:'前臂背侧宜轻柔。', source:pointSources.wrist},
    {name:'肩髎', part:'上肢', meridian:'手少阳三焦经', pos:[0.42,0.76,0.50], location:'肩峰后下方，上臂外展时呈凹陷处。', uses:'传统用于肩臂不举。', note:'肩部可依方案操作。', source:pointSources.hand},
    {name:'翳风', part:'头部', meridian:'手少阳三焦经', pos:[0.50,0.83,0.47], location:'耳垂后方，乳突与下颌角之间凹陷处。', uses:'传统用于耳鸣、口面不适。', note:'耳后宜轻柔。', source:pointSources.face},
    {name:'丝竹空', part:'头部', meridian:'手少阳三焦经', pos:[0.55,0.905,0.56], location:'眉梢外端凹陷处。', uses:'传统用于头痛、目赤。', note:'眼周宜轻柔。', source:pointSources.face},
    /* ── 足少阳胆经（头侧→肩→身侧→腿外→足） ── */
    {name:'瞳子髎', part:'头部', meridian:'足少阳胆经', pos:[0.55,0.895,0.56], location:'目外眦旁约0.5寸，眶骨外缘凹陷处。', uses:'传统用于目部、头痛。', note:'眼周宜轻柔。', source:pointSources.face},
    {name:'听会', part:'头部', meridian:'足少阳胆经', pos:[0.53,0.875,0.51], location:'耳屏间切迹前方凹陷处。', uses:'传统用于耳鸣、耳聋。', note:'耳前宜轻柔。', source:pointSources.face},
    {name:'风池', part:'头部', meridian:'足少阳胆经', pos:[0.50,0.815,0.33], location:'后颈部枕骨下方，两条大筋外缘的凹陷处。', uses:'传统用于头痛、鼻塞及头颈不适。', note:'后颈敏感，避免重压及对颈部作粗暴刮拭。', source:pointSources.face},
    {name:'肩井', part:'颈背', meridian:'足少阳胆经', pos:[0.44,0.765,0.47], location:'肩上，大椎与肩峰端连线的中点处。', uses:'传统用于肩背、颈项不适。', note:'肩部可依方案操作；孕妇慎用。', source:pointSources.neck},
    {name:'环跳', part:'下肢', meridian:'足少阳胆经', pos:[0.44,0.52,0.40], location:'股骨大转子与骶管裂孔连线外1/3与内2/3交点处。', uses:'传统用于腰腿、坐骨神经痛。', note:'臀部深层操作宜轻。', source:pointSources.leg},
    {name:'风市', part:'下肢', meridian:'足少阳胆经', pos:[0.53,0.34,0.44], location:'大腿外侧正中，直立垂手中指尖处。', uses:'传统用于下肢痿痹、瘙痒。', note:'大腿外侧可依方案操作。', source:pointSources.leg},
    {name:'阳陵泉', part:'下肢', meridian:'足少阳胆经', pos:[0.565,0.26,0.42], location:'小腿外侧，腓骨小头前下方凹陷处。', uses:'传统用于胁痛、下肢及筋病。', note:'膝外侧宜轻柔。', source:pointSources.leg},
    {name:'悬钟', part:'下肢', meridian:'足少阳胆经', pos:[0.56,0.115,0.42], location:'小腿外侧，外踝尖直上约3寸。', uses:'传统用于项强、下肢不适。', note:'小腿外侧宜轻柔。', source:pointSources.leg},
    {name:'足临泣', part:'下肢', meridian:'足少阳胆经', pos:[0.55,0.035,0.45], location:'足背第4、5跖骨结合部前方凹陷处。', uses:'传统用于头痛、乳胀、足背不适。', note:'足背皮肤薄，宜轻柔。', source:pointSources.leg},
    /* ── 足厥阴肝经（足大趾→腿内→腹→胸） ── */
    {name:'大敦', part:'下肢', meridian:'足厥阴肝经', pos:[0.51,0.025,0.55], location:'足大趾外侧指甲角旁约0.1寸。', uses:'传统用于崩漏、疝气。', note:'指端操作轻柔。', source:pointSources.leg},
    {name:'行间', part:'下肢', meridian:'足厥阴肝经', pos:[0.53,0.04,0.57], location:'足背第1、2趾间，趾蹼缘后方。', uses:'传统用于头痛、目赤、急躁。', note:'足背宜轻柔。', source:pointSources.leg},
    {name:'太冲', part:'下肢', meridian:'足厥阴肝经', pos:[0.54,0.045,0.60], location:'足背，第1、2跖骨结合部前方凹陷中。', uses:'传统用于头痛、目胀、急躁等肝经相关不适。', note:'足背皮肤较薄，操作宜轻柔。', source:pointSources.leg},
    {name:'蠡沟', part:'下肢', meridian:'足厥阴肝经', pos:[0.53,0.115,0.51], location:'小腿内侧，内踝尖上约5寸，胫骨内侧面中央。', uses:'传统用于妇科、下肢不适。', note:'小腿内侧宜轻柔。', source:pointSources.leg},
    {name:'曲泉', part:'下肢', meridian:'足厥阴肝经', pos:[0.545,0.28,0.49], location:'屈膝时，膝内侧横纹端凹陷处。', uses:'传统用于膝股、腹痛。', note:'膝内侧宜轻柔。', source:pointSources.leg},
    {name:'章门', part:'胸腹', meridian:'足厥阴肝经', pos:[0.55,0.60,0.50], location:'侧腹部，第11肋游离端下方。', uses:'传统用于胁痛、腹胀。', note:'胁腹宜轻柔。', source:pointSources.face},
    {name:'期门', part:'胸腹', meridian:'足厥阴肝经', pos:[0.565,0.70,0.575], location:'乳头直下，第6肋间隙处。', uses:'传统用于胁痛、胸闷。', note:'胸胁宜轻柔。', source:pointSources.face},
    /* ── 经外奇穴 ── */
    {name:'印堂', part:'头部', meridian:'督脉', pos:[0.50,0.925,0.60], location:'两眉头之间的中点处。', uses:'传统用于头痛、鼻部不适等头面部症状。', note:'面部皮肤敏感，图示只用于识别位置；不宜重刮或追求出痧。', source:pointSources.face},
    {name:'太阳', part:'头部', meridian:'经外奇穴', pos:[0.56,0.90,0.54], location:'眉梢与目外眦之间，向后约一横指凹陷处。', uses:'传统用于头痛、目部不适。', note:'颞部宜轻柔。', source:pointSources.face}
  ];
  const mappedByName = new Map(atlasPoints.map(point => [point.name, point]));
  const standardPoints = (window.STANDARD_ACUPOINTS || []).map(([name, code, chapter, ordinal]) => ({
    name, code, chapter, ordinal, meridian: window.STANDARD_MERIDIANS[chapter - 1], mapped: mappedByName.get(name) || null
  }));
  const terms = [
    {title:'出痧',group:'基础概念',body:'刮拭后局部皮肤出现红色或紫红色斑点、斑片等表现，称为出痧。出痧多少因人、部位和操作条件而异，不应以出痧越多越好。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'补法与泻法',group:'手法',body:'传统刮痧术语。补法通常指较轻、较慢的刺激；泻法通常指相对较重、较快的刺激。选择须结合体质与病证，由专业人员判断，不宜自行照字面加大力度。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'平补平泻',group:'手法',body:'介于传统补法和泻法之间的操作思路，速度与力度相对适中。具体手法仍需结合病证和个人耐受情况。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'痧象',group:'观察',body:'刮拭后皮肤印记的颜色、形态和分布。它可作观察记录，但不能单凭颜色判断疾病、脏腑状态或治疗效果。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'刮痧介质',group:'操作准备',body:'置于皮肤和刮板之间的润滑材料，用来减少摩擦。应留意皮肤过敏及破损情况，不自行使用刺激性介质。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'何时不宜刮痧',group:'安全',body:'皮肤破损或感染、出血倾向、急危重症等情况不宜自行刮痧；出现急重症应及时到医疗机构就诊。孕期及特殊人群应先咨询医师。',source:'https://zyj.beijing.gov.cn/sy/whkp/202207/t20220728_2781247.html'},
    {title:'经络',group:'基础概念',body:'人体内运行气血、联系脏腑肢节、沟通表里内外的通路。刮痧常以经络循行线作为刮拭路线。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'腧穴',group:'基础概念',body:'经络之气输注于体表的部位，是刮痧取穴与刺激的基础。不同腧穴的主治侧重不同。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'面刮法',group:'手法',body:'用刮板平直边缘以一定角度沿皮肤单向刮拭，是刮痧最常用的刮拭方法。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'角刮法',group:'手法',body:'用刮板角部着力刮拭，适用于穴位、骨缝等肌肉较少或需要精确定位的部位。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'点按法',group:'手法',body:'用刮板角部在穴位处垂直点压并短暂停留，多用于重点穴位刺激，力度宜柔和。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'揉法',group:'手法',body:'用刮板角或指腹在穴位处轻柔回旋揉动，刺激较缓和，常与刮法配合使用。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'循经刮痧',group:'手法',body:'沿经络循行路线进行刮拭，目的在于调节经气、疏通经络，是最常见的取线方式。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'刮拭方向',group:'操作准备',body:'一般沿肌肉走向或经络循行方向单向刮拭，避免来回反复刮，以减少皮肤损伤。',source:'https://zxyy.thnet.gov.cn/thqzyy/tszk/202111/39260aa3f899406b86e60d662036b66d.shtml'},
    {title:'刮痧板',group:'操作准备',body:'常见材质有牛角、玉石、陶瓷等，边缘应光滑圆润，使用前需清洁并检查有无破损。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'出痧程度',group:'观察',body:'出痧多少与体质、部位及操作强度相关，并非出痧越多疗效越好，应整体评估。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'痧色辨析',group:'观察',body:'痧点颜色的深浅与分布可供观察记录，但不能单凭痧色判断脏腑状态或治疗效果。',source:'https://zyj.beijing.gov.cn/sy/whkp/202509/t20250901_4188547.html'},
    {title:'刮痧力度',group:'安全',body:'力度以能耐受、局部皮肤微红为度，不宜过重；出现明显疼痛或破损应立即停止。',source:'https://zyj.beijing.gov.cn/sy/whkp/202207/t20220728_2781247.html'},
    {title:'特殊人群',group:'安全',body:'老人、儿童、体质虚弱者及孕期人群刮痧应谨慎，操作前先咨询专业医师。',source:'https://zyj.beijing.gov.cn/sy/whkp/202207/t20220728_2781247.html'}
  ];
  const bookNames = ['','《刮痧疗法》','《实用刮痧疗法》','《图解刮痧疗法》','《循经刮痧疗法》','《中医刮痧疗法》'];
  const storeKey = 'shazheng-compare-v1';
  const escape = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  let atlasView = 'front';
  let selectedPoint = '印堂';
  let compareQuery = '';
  function readSelection() {
    try {
      const value = JSON.parse(localStorage.getItem(storeKey) || '[]');
      return Array.isArray(value) ? value.filter(x => typeof x.id === 'string' && Number.isInteger(x.variant)).slice(0,3) : [];
    } catch { return []; }
  }
  let selection = readSelection();
  function saveSelection() {
    try { localStorage.setItem(storeKey, JSON.stringify(selection)); } catch { /* browser storage may be disabled */ }
    updateBadge();
  }
  function updateBadge() {
    const badge = document.querySelector('#compareBadge');
    if (!badge) return;
    badge.hidden = selection.length === 0;
    badge.textContent = String(selection.length);
  }
  function addToCompare(id, variant = 0) {
    const disease = (window.DISEASES || []).find(x => x.id === id);
    if (!disease || !disease.variants[variant]) return 'missing';
    if (selection.some(x => x.id === id && x.variant === variant)) return 'exists';
    if (selection.length >= 3) return 'full';
    selection.push({id,variant});
    saveSelection();
    return 'added';
  }
  function renderAtlas(target) {
    let partFilter = '全部';
    let meridianFilter = '全部';
    let searchQuery = '';
    const matches = p => (partFilter === '全部' || (p.mapped?.part || '未标定') === partFilter) && (meridianFilter === '全部' || p.meridian === meridianFilter) && (!searchQuery || p.name.includes(searchQuery) || p.code.toLowerCase().includes(searchQuery.toLowerCase()) || p.meridian.includes(searchQuery));
    const parts = () => ['全部', ...new Set(atlasPoints.map(p => p.part)), '未标定'];
    const meridians = () => ['全部', ...window.STANDARD_MERIDIANS];
    /* 骨度分寸演示规则：仅记录可审计的纵向比例和横向条件；没有横向骨缘/肌腱确认时必须人工复核。 */
    const cunRules = {
      '内关': {code:'PC6', segment:'腕横纹（大陵）—肘横纹（曲泽）', total:12, target:2, direction:'近心端', horizontal:'前臂掌侧，两筋之间（掌长肌腱与桡侧腕屈肌腱之间；需触诊确认）', status:'待人工复核', reason:'纵向比例可演示；肌腱间隙需由专业人员现场确认。'},
      '足三里': {code:'ST36', segment:'犊鼻—解溪', total:16, target:3, direction:'远心端', horizontal:'小腿前外侧，胫骨前嵴与腓骨侧的横向条件需触诊确认', status:'待人工复核', reason:'纵向比例可演示；骨缘条件未由模型确认。'},
      '三阴交': {code:'SP6', segment:'内踝尖—阴陵泉', total:13, target:3, direction:'近心端', horizontal:'胫骨内侧缘后方；骨缘需现场触诊确认', status:'待人工复核', reason:'纵向比例可演示；骨缘条件未由模型确认。'}
    };
    const renderCunDemo = p => {
      const r = window.ACUPUNCTURE_LOCATION_RULES?.[p.name] || cunRules[p.name];
      if (!r) return '<section class="cun-demo cun-demo-empty"><h3>骨度分寸定位演示</h3><p>该穴尚未建立可核验的分寸规则。现有圆点仍是区域示意，不能作为标准精确定位。</p></section>';
      if (!r.total || !r.target) return '<section class="cun-demo cun-demo-empty"><div class="cun-demo-head"><h3>逐穴定位登记 · '+escape(r.code)+'</h3><span class="review-badge">'+escape(r.status)+'</span></div><p>起止标志：'+escape(r.segment)+'。横向条件：'+escape(r.horizontal)+'。</p><details><summary>GB/T 12346—2021 原文登记</summary><p>'+escape(r.sourceText || '')+'</p></details><p>尚未完成骨度总寸数与人体模型的逐穴复核，不显示为标准精确定位。</p></section>';
      const ticks = Array.from({length:r.total + 1}, (_, i) => '<i class="cun-tick '+(i === r.target ? 'target' : '')+'" style="left:'+(i/r.total*100)+'%"><b>'+(i === r.target ? '目标' : '')+'</b></i>').join('');
      return '<section class="cun-demo"><div class="cun-demo-head"><h3>骨度分寸定位演示 · '+escape(r.code)+'</h3><span class="review-badge">'+escape(r.status)+'</span></div><div class="cun-summary"><span>起止标志：'+escape(r.segment)+'</span><strong>区段总寸数：'+r.total+' 寸</strong><span>目标刻度：'+r.target+' 寸（'+escape(r.direction)+'）</span></div><div class="cun-ruler" aria-label="'+escape(r.segment)+' '+r.total+'寸刻度尺"><div class="cun-ruler-line">'+ticks+'</div><div class="cun-ruler-labels"><span>起点</span><span>终点</span></div></div><dl class="cun-conditions"><dt>横向解剖条件</dt><dd>'+escape(r.horizontal)+'</dd><dt>最终候选点</dt><dd class="candidate">'+escape(p.name)+'（'+escape(r.code)+'）· '+escape(r.status)+'</dd></dl><p class="cun-warning">'+escape(r.reason || '模型仍需医学复核。')+' 不显示为标准精确定位。</p><details class="cun-source"><summary>GB/T 12346—2021 原文登记</summary><p>'+escape(r.sourceText || '')+'</p></details><div class="cun-sides"><span>左侧计算：'+r.target+'/'+r.total+' 寸 → '+escape(r.status)+'</span><span>右侧计算：'+r.target+'/'+r.total+' 寸 → '+escape(r.status)+'</span></div></section>';
    };
    const updatePanel = p => {
      const mapped = p.mapped;
      target.querySelector('#atlasInfoPanel').innerHTML = `<span class="info-kicker">${escape(p.meridian)} · ${escape(p.code)} · 标准第 5.${p.chapter}.${p.ordinal} 节</span><h2>${escape(p.name)}</h2>${renderCunDemo(p)}${mapped ? `<dl><dt>现有文字定位（待逐穴复核）</dt><dd>${escape(mapped.location)}</dd><dt>传统主治</dt><dd>${escape(mapped.uses)}</dd><dt>刮痧要点</dt><dd>${escape(mapped.note)}</dd></dl><p class="model-note">模型圆点仅示意体表大致区域，不可据此取穴。</p>` : '<p class="model-note">此穴尚无经医学复核的三维坐标和本站文字定位，因此不在模型上放置圆点。请参照国家标准原文定位。</p>'}<a href="${locationStandard}" target="_blank" rel="noopener noreferrer">查阅 GB/T 12346—2021 标准 ↗</a>${mapped ? `<a href="${escape(mapped.source)}" target="_blank" rel="noopener noreferrer">查看现有穴位资料 ↗</a>` : ''}`;
    };
    function refresh() {
      const visible = standardPoints.filter(matches);
      if (!visible.some(p => p.name === selectedPoint)) selectedPoint = visible.length ? visible[0].name : '';
      const cur = standardPoints.find(p => p.name === selectedPoint);
      if (cur) updatePanel(cur);
      target.querySelector('#atlasPointList').innerHTML = visible.length ? visible.map(p => `<button type="button" data-point="${escape(p.name)}" class="${p.name === selectedPoint ? 'active' : ''} ${p.mapped ? '' : 'unmapped'}">${escape(p.name)} <small>${escape(p.code)}${p.mapped ? '' : ' · 未标定'}</small></button>`).join('') : '<span>没有匹配的穴位</span>';
      if (window.__atlas3d) window.__atlas3d.setFilter(visible.filter(p => p.mapped).map(p => p.name), cur?.mapped ? selectedPoint : '');
    }
    target.innerHTML = `<section class="feature-intro"><p class="eyebrow">国标目录 · 三维示意</p><h1>穴位图谱</h1><p>已收录 GB/T 12346—2021 十四经穴 362 个名称与编号。骨度分寸定位演示先以少量规则样例核验，左右侧独立计算；仅完成纵向比例、尚不能确认肌腱或骨缘的穴位统一标为“待人工复核”，不显示为标准精确定位。旧版示意坐标仍只表示体表大致区域，经络走向不自动连线。</p></section><div class="atlas3d-layout"><section class="atlas3d-main"><div class="atlas3d-controls"><label>部位<select id="atlasPart">${parts().map(x => `<option ${x === partFilter ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>经脉<select id="atlasMeridian">${meridians().map(x => `<option ${x === meridianFilter ? 'selected' : ''}>${x}</option>`).join('')}</select></label><input id="atlasSearch" type="search" placeholder="搜索穴位、编号…" autocomplete="off"></div><p class="atlas-catalog-note">国标十四经穴：${standardPoints.length} 个 · 已有模型示意：${standardPoints.filter(p => p.mapped).length} 个；“未标定”不显示三维圆点。</p><div class="atlas-point-list" id="atlasPointList" aria-label="匹配的穴位"></div><div class="atlas-view-controls" aria-label="人体视角"><button type="button" data-view="front" class="active">正面</button><button type="button" data-view="back">背面</button><button type="button" data-view="side">侧面</button><span>点位颜色区分经脉；圆点仅作区域示意</span></div><div class="atlas3d-stage"><div class="atlas3d-fallback-figure" aria-label="人体模型示意"><div class="fallback-head"></div><div class="fallback-body"></div><div class="fallback-arm left"></div><div class="fallback-arm right"></div><div class="fallback-leg left"></div><div class="fallback-leg right"></div><span>模型加载中 / 示意层</span></div><canvas class="atlas3d-canvas" id="atlas3dCanvas"></canvas><div class="atlas3d-hint">拖拽旋转 · 滚轮缩放 · 点击穴位查看</div></div></section><aside class="atlas-info" id="atlasInfoPanel"></aside></div>`;
    const visualizedPoints = atlasPoints.filter(point => standardPoints.some(p => p.name === point.name));
    window.ATLAS3D_DATA = { points: visualizedPoints };
    window.ATLAS3D_ON_SELECT = name => {
      selectedPoint = name;
      const cur = standardPoints.find(p => p.name === name);
      if (cur) updatePanel(cur);
      target.querySelectorAll('#atlasPointList button').forEach(button => button.classList.toggle('active', button.dataset.point === name));
      if (cur?.mapped) {
        const view = /胆经|三焦经/.test(cur.meridian) && cur.mapped.pos[2] < 0.55 ? 'side' : cur.mapped.pos[2] < 0.49 ? 'back' : 'front';
        target.querySelectorAll('.atlas-view-controls button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
      }
    };
    target.querySelector('#atlasPart').addEventListener('change', e => { partFilter = e.target.value; refresh(); });
    target.querySelector('#atlasMeridian').addEventListener('change', e => { meridianFilter = e.target.value; refresh(); });
    target.querySelector('#atlasSearch').addEventListener('input', e => { searchQuery = e.target.value.trim(); refresh(); });
    target.querySelector('#atlasPointList').addEventListener('click', e => { const button = e.target.closest('button[data-point]'); if (!button) return; selectedPoint = button.dataset.point; updatePanel(standardPoints.find(p => p.name === selectedPoint)); target.querySelectorAll('#atlasPointList button').forEach(item => item.classList.toggle('active', item === button)); if (standardPoints.find(p => p.name === selectedPoint)?.mapped) window.__atlas3d?.highlight(selectedPoint); });
    target.querySelector('.atlas-view-controls').addEventListener('click', e => { const button = e.target.closest('button[data-view]'); if (!button) return; target.querySelectorAll('.atlas-view-controls button').forEach(item => item.classList.toggle('active', item === button)); window.__atlas3d?.setView(button.dataset.view); });
    selectedPoint = standardPoints.find(p => p.name === '印堂')?.name || standardPoints[0]?.name || '';
    refresh();
    window.dispatchEvent(new CustomEvent('atlas:ready', { detail: { canvas: target.querySelector('#atlas3dCanvas'), data: { points: visualizedPoints } } }));
  }
  function renderGlossary(target) {
    target.innerHTML = `<section class="feature-intro"><p class="eyebrow">新手阅读</p><h1>刮痧知识词典</h1><p>用简短解释理解教材中的常见术语。传统术语不是独立诊断结论，具体方案仍需结合个人情况与专业判断。</p></section><div class="term-grid">${terms.map(term => `<article class="term-card"><span>${escape(term.group)}</span><h2>${escape(term.title)}</h2><p>${escape(term.body)}</p><a href="${escape(term.source)}" target="_blank" rel="noopener noreferrer">资料依据 ↗</a></article>`).join('')}</div>`;
  }
  function planField(variant) {
    return variant.fields.find(f => /处方与操作|刮治部位及方法|刮拭取穴|刮痧治疗/.test(f.title)) ||
      variant.fields.find(f => /取穴|刮治|刮痧/.test(f.title)) || null;
  }
  function extractedPoints(variant) {
    const field = planField(variant);
    if (!field) return [];
    return (window.POINT_NAMES || []).filter(name => field.body.includes(name));
  }
  function buildVerdict(chosen, pointsByPlan) {
    const plans = chosen.map(({disease,variant}) => { const f = planField(disease.variants[variant]); return f ? f.body : ''; });
    const sharedAll = pointsByPlan.length && pointsByPlan[0].length ? pointsByPlan[0].filter(p => pointsByPlan.every(list => list.includes(p))) : [];
    const uniqueByPlan = pointsByPlan.map((list,i) => list.filter(p => pointsByPlan.filter((l,j)=>j!==i).every(l=>!l.includes(p))));
    const techniqueNames = ['泻刮','角揉','角推','角刮','面刮','拍法','叩击法','拍击','叩击','揉法','点按','循经'];
    const techByPlan = plans.map(body => techniqueNames.filter(t => body.includes(t)));
    const techCommon = techByPlan.length && techByPlan[0].length ? techByPlan[0].filter(t => techByPlan.every(list => list.includes(t))) : [];
    const meridianNames = ['督脉','任脉','手太阴肺经','手阳明大肠经','足阳明胃经','足太阴脾经','手少阴心经','手太阳小肠经','足太阳膀胱经','足少阴肾经','手厥阴心包经','手少阳三焦经','足少阳胆经','足厥阴肝经'];
    const meridianByPlan = plans.map(body => meridianNames.filter(m => body.includes(m)));
    const rows = [];
    if (sharedAll.length) rows.push(`<div class="verdict-row"><h3>共同穴位</h3><div class="compare-points">${sharedAll.map(n=>`<span class="shared">${escape(n)}</span>`).join('')}</div><p class="verdict-note">这 ${chosen.length} 条方案都选用了以上穴位，核心取穴思路一致。</p></div>`);
    chosen.forEach(({disease,variant},i) => {
      if (uniqueByPlan[i].length) rows.push(`<div class="verdict-row"><h3>${escape(disease.name)}（${escape(disease.variants[variant].label || '知识')}）独有穴位</h3><div class="compare-points">${uniqueByPlan[i].map(n=>`<span class="unique">${escape(n)}</span>`).join('')}</div></div>`);
      if (meridianByPlan[i].length) rows.push(`<div class="verdict-row"><h3>${escape(disease.name)} 经络侧重</h3><div class="compare-tags">${meridianByPlan[i].map(m=>`<span>${escape(m)}</span>`).join('')}</div></div>`);
    });
    if (techCommon.length) rows.push(`<div class="verdict-row"><h3>共同手法</h3><div class="compare-tags">${techCommon.map(t=>`<span>${escape(t)}</span>`).join('')}</div></div>`);
    let summary;
    if (chosen.length === 1) summary = '当前仅加入了一条方案，再添加 1–2 条即可进行取穴与手法的横向对比。';
    else if (sharedAll.length >= 2) summary = `${chosen.length} 条方案在“${sharedAll.slice(0,3).map(escape).join('、')}”等穴上取穴重合度较高，说明这些病证在辨证取穴思路上有共通之处；差异主要落在各自病机所对应的侧重部位上。`;
    else summary = `${chosen.length} 条方案取穴重合较少，各方案按自身病机与分型选用不同穴位，适合分别辨证、灵活取穴。`;
    return `<section class="compare-verdict"><div class="verdict-head"><p class="eyebrow">智能小结</p><h2>对比结论</h2></div>${rows.join('')}<p class="verdict-summary">${summary}</p><p class="verdict-note">以上结论由方案原文中的穴位与手法关键词自动归纳，仅作学习参考，具体施治请以专业医师判断为准。</p></section>`;
  }
  function renderCompare(target) {
    selection = selection.filter(x => (window.DISEASES || []).some(d => d.id === x.id && d.variants[x.variant]));
    saveSelection();
    const chosen = selection.map(x => ({disease:window.DISEASES.find(d => d.id === x.id),variant:x.variant}));
    const pointsByPlan = chosen.map(x => extractedPoints(x.disease.variants[x.variant]));
    const frequency = new Map();
    pointsByPlan.forEach(points => points.forEach(name => frequency.set(name,(frequency.get(name) || 0) + 1)));
    const verdict = chosen.length ? buildVerdict(chosen, pointsByPlan) : null;
    target.innerHTML = `<section class="feature-intro"><p class="eyebrow">并列阅读</p><h1>方案对比</h1><p>最多并排比较 3 条病证方案。取穴标签仅从原方案文字中识别；原文始终保留，标签未必涵盖所有部位、经络与操作。</p></section><section class="compare-picker"><label for="compareSearch">添加病证方案</label><input id="compareSearch" type="search" placeholder="输入疾病名称…" value="${escape(compareQuery)}" autocomplete="off"><div class="compare-results" id="compareResults"></div></section>${chosen.length ? `<div class="compare-legend"><span><i class="shared-dot"></i>多方案共有</span><span><i class="unique-dot"></i>当前方案独有</span></div><div class="compare-grid">${chosen.map(({disease,variant},index) => {const current=disease.variants[variant],field=planField(current),points=pointsByPlan[index];return `<article class="compare-card"><div class="compare-card-head"><div><small>${escape(bookNames[disease.book])}</small><h2>${escape(disease.name)}</h2></div><button type="button" data-remove="${index}" aria-label="移除${escape(disease.name)}">×</button></div><label>分型 / 知识<select data-compare-variant="${index}">${disease.variants.map((v,i) => `<option value="${i}" ${i === variant ? 'selected' : ''}>${escape(v.label || `知识 ${i+1}`)}</option>`).join('')}</select></label><h3>识别到的穴位</h3><div class="compare-points">${points.length ? points.map(name => `<span class="${frequency.get(name) > 1 ? 'shared' : 'unique'}">${escape(name)}</span>`).join('') : '<em>未从本方案识别到标准穴位名称</em>'}</div><h3>刮痧方案原文</h3><p class="compare-plan">${field ? escape(field.body) : '本条知识未包含独立的刮痧方案字段。'}</p></article>`;}).join('')}</div>${verdict}` : '<div class="compare-empty">尚未加入方案。输入疾病名称，或在病证详情页点“加入对比”。</div>'}`;
    const input = target.querySelector('#compareSearch');
    const results = target.querySelector('#compareResults');
    function updateResults() {
      compareQuery = input.value;
      const q = compareQuery.trim();
      const matches = q ? window.DISEASES.filter(d => d.name.includes(q)).slice(0,8) : [];
      results.innerHTML = matches.map(d => `<button type="button" data-add-disease="${escape(d.id)}"><strong>${escape(d.name)}</strong><small>${escape(bookNames[d.book])}</small></button>`).join('');
    }
    input.addEventListener('input', updateResults);
    results.addEventListener('click', event => {
      const button = event.target.closest('[data-add-disease]');
      if (!button) return;
      const status = addToCompare(button.dataset.addDisease,0);
      if (status === 'full') { results.innerHTML = '<p>最多比较 3 条方案，请先移除一条。</p>'; return; }
      compareQuery = '';
      renderCompare(target);
    });
    target.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => { selection.splice(Number(button.dataset.remove),1); saveSelection(); renderCompare(target); }));
    target.querySelectorAll('[data-compare-variant]').forEach(select => select.addEventListener('change', () => { selection[Number(select.dataset.compareVariant)].variant = Number(select.value); saveSelection(); renderCompare(target); }));
    updateResults();
  }
  return {renderAtlas,renderGlossary,renderCompare,addToCompare,updateBadge};
})();
