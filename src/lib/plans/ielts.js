import { block } from '../schedule/model.js'

const ROOT = 'Tutorial/新东方-雅思'

const PHASES = [
  { id: 'A', name: 'A 地基', weeks: [1, 8], exit: '能拆句、发音过关、精听流程固定' },
  { id: 'B', name: 'B 知心6.0', weeks: [9, 16], exit: '约 6.0 · 读文档够用 · 可停考' },
  { id: 'C', name: 'C 剑20真题', weeks: [17, 20], exit: '剑20 四套订正完 · 英语能力达标点' },
  { id: 'D', name: 'D 文档维持（稀疏）', weeks: [21, 36], exit: '每周/隔周读技术英文；不再冲分' },
  { id: 'E', name: 'E 长期维持', weeks: [37, 48], exit: '隔周文档 + 可选弱项回炉' },
]

const GRAMMAR = [
  null,
  null,
  ['02.简单句的核心构成', '03.简单句的核心变化'],
  ['04.简单句的扩展', '05.简单句的提升'],
  ['06.简单句的综合运用', '07.并列句'],
  ['08.复合句', '09.特殊结构'],
  ['10.特殊句式', '11.长难句的综合运用'],
  ['12.雅思语法备考指导', '讲义总复习'],
]

const TARA = [null, null, ['1', '2'], ['3', '4'], ['5'], null, null, null]

function subjectWeek(courseTitle, path, type, weekInPair) {
  if (weekInPair === 0) {
    return {
      focus: `开课：${courseTitle}（消化题型/课次）`,
      paths: [path],
      must: [`跟完本周 ${courseTitle} 课次`, '课堂笔记只记规则与例句', '每日 100句 + 语料库'],
      mon: [block(type, courseTitle, '导学 / 前段课', path, '一次只开这一科')],
      tue: [block(type, courseTitle, '中段课', path)],
      wed: [block(type, courseTitle, '中段课', path)],
      thu: [block(type, courseTitle, '后段课', path)],
      fri: [block(type, courseTitle, '收束课 / 练习', path)],
      sat: [block('meta', '本周复盘', '错题与句型清单', path, '30–40min')],
    }
  }
  return {
    focus: `巩固：${courseTitle}（练习+开口/动笔）`,
    paths: [path],
    must: [`完成 ${courseTitle} 练习/作业段`, '用短真题段落验证', '每日 100句 + 语料库'],
    mon: [block(type, courseTitle, '弱项回看', path)],
    tue: [block(type, courseTitle, '专项练习', path)],
    wed: [
      block(
        type === 'listen' || type === 'read' ? 'test' : type,
        '短真题段',
        '对应技能 1 段',
        `${ROOT}/05`,
        '限时',
      ),
    ],
    thu: [block(type, courseTitle, '再练 / 范文对照', path)],
    fri: [block(type, courseTitle, '输出：录音或短文', path)],
    sat: [block('meta', '科末小结', '能否升档？', path)],
  }
}

function testWeek(testName, filesPath, weekNote) {
  return {
    focus: weekNote,
    paths: [filesPath, `${ROOT}/05/02.【精讲解析】剑桥雅思真题精讲pdf`],
    must: [`限时做完 ${testName}`, '对答案 + 精讲订正', '错题本只记规律'],
    mon: [block('listen', `${testName} Listening`, '限时', filesPath)],
    tue: [block('read', `${testName} Reading`, '限时', filesPath)],
    wed: [block('write', `${testName} Writing`, 'Task1+2', filesPath)],
    thu: [block('speak', `${testName} Speaking`, '自问自答录音', filesPath)],
    fri: [block('test', '精讲订正', '听读为主', `${ROOT}/05/02.精讲解析`)],
    sat: [block('meta', '错题归类', '题型/词汇/语法', filesPath)],
  }
}

function buildWeek(w) {
  if (w === 1) {
    return {
      focus: '认路：搞清考试形态 + 定作息 + 装好精听流程',
      paths: [
        `${ROOT}/01.小白指南/05.雅思小白课（小白必看）`,
        `${ROOT}/02.计划+学习方法`,
        `${ROOT}/03/01.雅思语法（推荐）/01.雅思语法导学`,
        `${ROOT}/03/05…/语料库使用方法（必看）`,
      ],
      must: [
        '看完小白课 4 节 mp4',
        '读完《计划详细备考方法》并填 3 个月表',
        '语法导学 + 浏览讲义目录',
        '读完语料库学习方法 pdf',
      ],
      mon: [block('guide', '小白课 · 听力', '雅思小白：听力.mp4', `${ROOT}/01/05`)],
      tue: [block('guide', '小白课 · 阅读', '雅思小白：阅读.mp4', `${ROOT}/01/05`)],
      wed: [block('guide', '小白课 · 写作', '雅思小白：写作.mp4', `${ROOT}/01/05`)],
      thu: [block('guide', '小白课 · 口语', '小白课：口语.mp4', `${ROOT}/01/05`)],
      fri: [
        block('meta', '计划方法', '1.计划详细备考方法.pdf', `${ROOT}/02`),
        block('meta', '填表', '雅思3个月备考计划', `${ROOT}/02`),
      ],
      sat: [
        block('grammar', '语法导学', '01.雅思语法导学', `${ROOT}/03/01`),
        block('listen', '语料库方法', '学习方法.pdf', `${ROOT}/03/05/语料库使用方法`),
      ],
    }
  }

  if (w >= 2 && w <= 7) {
    const g = GRAMMAR[w]
    const t = TARA[w]
    const week = {
      focus: `地基：语法 ${g.join(' → ')}${t ? ' + Tara ' + t.join('&') : ''}`,
      paths: [
        `${ROOT}/03/01.雅思语法（推荐）`,
        t ? `${ROOT}/03/04. Tara发音课录像及讲义` : null,
        `${ROOT}/03/03.100个句子…`,
        `${ROOT}/03/05.王陆语料库`,
      ].filter(Boolean),
      must: [
        `语法：${g[0]}、${g[1]}`,
        t ? `Tara：第 ${t.join('、')} 节` : 'Tara 已结束，跟读复习旧课 20min×2',
        '每日 100句 1 句 + 语料库 1 段',
      ],
      mon: [block('grammar', '语法', g[0], `${ROOT}/03/01/${g[0]}`)],
      tue: [block('grammar', '语法', `${g[0]} 练习/讲义`, `${ROOT}/03/01`)],
      wed: [block('grammar', '语法', g[1], `${ROOT}/03/01/${g[1]}`)],
      thu: [block('grammar', '语法', `${g[1]} 练习/讲义`, `${ROOT}/03/01`)],
      fri: t
        ? [block('pron', 'Tara 发音', `第 ${t[0]} 节`, `${ROOT}/03/04`)]
        : [block('pron', 'Tara 复习', '跟读旧课选段', `${ROOT}/03/04`)],
      sat:
        t && t[1]
          ? [block('pron', 'Tara 发音', `第 ${t[1]} 节`, `${ROOT}/03/04`)]
          : [block('meta', '周复盘', '长难句拆 5 句', `${ROOT}/03/01`)],
    }
    if (t && t.length === 1 && w === 4) {
      week.fri = [block('pron', 'Tara 发音', '第 5 节 · 重读语调连读', `${ROOT}/03/04`)]
      week.sat = [block('pron', '发音收束', '5 节挑段跟读', `${ROOT}/03/04`)]
    }
    return week
  }

  if (w === 8) {
    return {
      focus: '地基收束：不新开大课，过自检再进 6.0',
      paths: [`${ROOT}/03/01`, `${ROOT}/03/04`, `${ROOT}/03/03`, `${ROOT}/03/05`],
      must: ['复习语法薄弱 2 章', 'Tara 全套挑段跟读', '自检：拆句 / 读准 / 精听流程'],
      mon: [block('grammar', '语法复习', '薄弱章 1', `${ROOT}/03/01`)],
      tue: [block('grammar', '语法复习', '薄弱章 2', `${ROOT}/03/01`)],
      wed: [block('pron', 'Tara 总复习', '1–5 节选段', `${ROOT}/03/04`)],
      thu: [block('vocab', '100句回顾', '本周累计句复述', `${ROOT}/03/03`)],
      fri: [block('listen', '语料库加练', '2 段精听', `${ROOT}/03/05`)],
      sat: [block('meta', '升档决定', '通过 → Term B', '', '不通过再留 1 周地基')],
    }
  }

  if (w >= 9 && w <= 16) {
    const idx = w - 9
    const courses = [
      ['雅思听力6分单项班', 'listen', `${ROOT}/04/知心/【6.0】/雅思听力6分单项班`],
      ['雅思阅读6分单项班', 'read', `${ROOT}/04/知心/【6.0】/雅思阅读6分单项班`],
      ['雅思写作6分单项班', 'write', `${ROOT}/04/知心/【6.0】/雅思写作6分单项班`],
      ['雅思口语6分单项班', 'speak', `${ROOT}/04/知心/【6.0】/雅思口语6分单项班`],
    ]
    const c = courses[Math.floor(idx / 2)]
    const week = subjectWeek(c[0], c[2], c[1], idx % 2)
    if (c[1] === 'speak') {
      week.fri = [...week.fri, block('speak', '题库 Part1', '当前季口语题', `${ROOT}/2026年口语题库/2026`)]
    }
    if (c[1] === 'write') {
      week.paths = [...week.paths, `${ROOT}/08.总结/小作文总结 (V3.0).pdf`]
    }
    return week
  }

  if (w >= 17 && w <= 20) {
    const tests = ['剑20 Test1', '剑20 Test2', '剑20 Test3', '剑20 Test4']
    return testWeek(tests[w - 17], `${ROOT}/05/剑雅20最终完整版`, `真题中段：${tests[w - 17]} 全科 + 订正`)
  }

  // Week 21+: enough for docs — sparse maintenance (no 6.5/7.0/王炸 unless you reopen them)
  if (w >= 21 && w <= 36) {
    const odd = w % 2 === 1
    return {
      focus: odd
        ? '文档维持：读 1 篇技术英文（BEP / crate docs / Tokio）'
        : '文档维持：精听 1 段语料库 或 跳过休息',
      paths: [`${ROOT}/03/05.王陆语料库`, '（配合主课表 BT/Iroh 英文文档）'],
      must: [
        odd ? '完成 40–60min 英文文档阅读（生词表 ≤15）' : '可选：语料库 1 段或完全休息',
        '不再新开冲分大课；弱项可回看旧笔记',
      ],
      mon: [],
      tue: odd
        ? [block('read', '技术英文', 'BEP / docs.rs / 官方 guide', '', '查词即可')]
        : [],
      wed: [],
      thu: [],
      fri: [],
      sat: odd
        ? []
        : [block('listen', '语料库可选', '1 段精听', `${ROOT}/03/05.王陆语料库`, '可跳过')],
    }
  }

  // Week 37–48: even sparser
  return {
    focus: '长期维持：隔周读文档；有余力才回炉弱项',
    paths: ['（英文文档）', `${ROOT}/03/05.王陆语料库`],
    must: [w % 2 === 1 ? '本周读 1 篇英文技术文' : '本周可空 · 或回看旧错题 20min'],
    mon: [],
    tue:
      w % 2 === 1
        ? [block('read', '文档维持', '隔周 1 篇', '', '40min')]
        : [block('meta', '空周', '休息或弱项回炉', '')],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
  }
}

/** @type {import('../schedule/model.js').PlanDef} */
export const ieltsPlan = {
  id: 'ielts',
  title: '英语 · IELTS→文档够用',
  subtitle: '地基 → 知心 6.0 → 剑20 → 文档维持（不再默认冲 6.5/7）',
  load: '~1.5–2h/day（第 21 周起大幅减负）',
  foot: '资料根 Tutorial/新东方-雅思 · 达标后稀疏；冲高分可自行重开 6.5/7.0 目录',
  subject: true,
  phases: PHASES,
  weekCount: 48,
  dailyCore(week) {
    if (week < 2 || week >= 21) return []
    return [
      block('vocab', '100句 · 当日 1 句', '跟读+结构+生词', `${ROOT}/03…/100个句子…`, '至第 20 周'),
      block('listen', '王陆语料库 · 1 段', '精听/跟读', `${ROOT}/03/05.王陆语料库`, '按使用方法 pdf'),
    ]
  },
  buildWeek,
}
