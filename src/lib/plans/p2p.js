import { block } from '../schedule/model.js'

/**
 * P2P plan for CS background — shallow on P2P specialty.
 * Aligned with knowledge/cs/p2p/P2P系统路线·书单.md + 专业培养方案.
 *
 * BRIDGE-01（网络与异步）已免修，不排进本表；文档仍保留该课。
 * Weight: light crypto · heavy BT & Raft · then 5→6→8→9→11 · 10 optional
 * English is a separate plan — never mix here.
 */

const BT = 'projects/rbittorrent'
const BT_BOOK = `${BT}/book`
const NOTE = 'knowledge/cs/p2p'
const BOOKS = `${NOTE}/P2P系统路线·书单.md`

const PHASES = [
  {
    id: '1',
    name: '1 应用密码',
    weeks: [1, 2],
    exit: '签名 + 校验的文件分块工具',
  },
  {
    id: '3',
    name: '3 经典 P2P (BT)',
    weeks: [3, 15],
    exit: '真实 swarm 能下；tracker+peer+choke+分片清楚',
  },
  {
    id: '4',
    name: '4 DHT',
    weeks: [16, 21],
    exit: '无 tracker 也能找 peer；能手推 Kademlia O(log n)',
  },
  {
    id: '5',
    name: '5 连通性',
    weeks: [22, 26],
    exit: '两台不同网络机器直连传文件（失败走 relay）',
  },
  {
    id: '6',
    name: '6 传播',
    weeks: [27, 29],
    exit: 'gossip 群聊 demo',
  },
  {
    id: '7',
    name: '7 分布式 (DDIA+Raft)',
    weeks: [30, 39],
    exit: 'DDIA 精读过；Raft lab 前两部分通过',
  },
  {
    id: '8',
    name: '8–9 数据+安全',
    weeks: [40, 45],
    exit: '离线可合并笔记 + 威胁模型 + 基础 E2EE/Noise',
  },
  {
    id: '11',
    name: '11 综合',
    weeks: [46, 49],
    exit: '一个完整去中心小应用 + 故障场景测试',
  },
]

const b = block

function slots(mon, tue, wed, thu, fri, sat) {
  return { mon, tue, wed, thu, fri, sat }
}

function weekCrypto(n) {
  const paths = ['Serious Cryptography 选章', 'RustCrypto / ed25519-dalek', NOTE]
  if (n === 1) {
    return {
      focus: '哈希 / 签名 / Merkle 直觉 + 分块设计',
      must: ['读完哈希+签名相关章笔记', '定好分块工具接口'],
      paths,
      ...slots(
        [b('guide', 'Serious Crypto', '哈希 / MAC', 'Serious Cryptography')],
        [b('guide', '签名', 'ed25519 用法', 'dalek docs')],
        [b('code', '分块设计', 'chunk + hash 列表', 'projects/')],
        [b('code', '实现哈希', '', 'projects/')],
        [b('code', '实现签名', 'manifest 签名', 'projects/')],
        [b('meta', '笔记', '会用不是会造', NOTE)],
      ),
    }
  }
  return {
    focus: '分块校验工具收束',
    must: ['工具可对文件签名/校验', '阶段 1 出口 ✓'],
    paths,
    ...slots(
      [b('code', 'Merkle/清单', '按需', 'projects/')],
      [b('code', 'CLI 收束', '', 'projects/')],
      [b('code', '测试', '篡改检测', 'projects/')],
      [b('guide', 'AEAD 浏览', '可选', 'Serious Cryptography')],
      [b('meta', '升档', '→ 阶段 3 BT', '')],
      [b('meta', '机动', '', '')],
    ),
  }
}

/** BT classic weeks 3–15 (13 weeks): ch1–3,5–7 + swarm — DHT deferred */
function weekBt(n) {
  const i = n - 3
  const plan = [
    { title: 'Ch1 生态', diff: '易', book: `${BT_BOOK}/02-第01章.md`, code: `${BT}/tests/echo.rs` },
    { title: 'Ch2 Bencode/Torrent', diff: '中', book: `${BT_BOOK}/03-第02章.md`, code: `${BT}/src/bencode.rs` },
    { title: 'Ch2 Magnet/元数据', diff: '中', book: `${BT_BOOK}/03-第02章.md`, code: `${BT}/src/magnet.rs` },
    { title: 'Ch3 Tracker HTTP', diff: '中偏难', book: `${BT_BOOK}/04-第03章.md`, code: `${BT}/src/` },
    { title: 'Ch3 Tracker UDP', diff: '中偏难', book: `${BT_BOOK}/04-第03章.md`, code: `${BT}/src/` },
    { title: 'Ch5 Peer Wire 握手', diff: '难', book: `${BT_BOOK}/06-第05章.md`, code: `${BT}/src/` },
    { title: 'Ch5 消息与状态机', diff: '难', book: `${BT_BOOK}/06-第05章.md`, code: `${BT}/src/` },
    { title: 'Ch5 下载管道', diff: '难', book: `${BT_BOOK}/06-第05章.md`, code: `${BT}/src/` },
    { title: 'Ch6 Choke/Unchoke', diff: '难', book: `${BT_BOOK}/07-第06章.md`, code: `${BT}/src/` },
    { title: 'Ch6 分片选择', diff: '难', book: `${BT_BOOK}/07-第06章.md`, code: `${BT}/src/` },
    { title: 'Ch7 完整性与 IO', diff: '中偏难', book: `${BT_BOOK}/08-第07章.md`, code: `${BT}/src/` },
    { title: 'Ch7 并发收束', diff: '中偏难', book: `${BT_BOOK}/08-第07章.md`, code: `${BT}/src/` },
    { title: '真实 swarm 联调', diff: '难', book: BT, code: `${BT}/tests` },
  ][i]

  const algo =
    n % 2 === 0
      ? [b('algo', '算法穿插', '图/哈希 → 为 DHT 铺路', 'Erickson 选章', '45–60min')]
      : []

  const stein =
    n === 3 || n === 9
      ? [b('guide', 'Steinmetz 选读', 'P2P 综述建坐标', 'Peer-to-Peer Systems and Applications')]
      : []

  return {
    focus: `经典 P2P · ${plan.title}（${plan.diff}）`,
    must: [`本周可测进展：${plan.title}`, n % 2 === 0 ? '算法穿插完成一小节' : 'BEP3/书对应节读完'],
    paths: [plan.book, plan.code, BT, BOOKS],
    ...slots(
      [b('code', plan.title, `读+设计 · ${plan.diff}`, plan.book, plan.diff)],
      [...algo, ...stein],
      [b('code', plan.title, '实现', plan.code, plan.diff)],
      [b('guide', 'BEP / 笔记', '对照实现', 'BEP 3')],
      [b('code', plan.title, '测试', `${BT}/tests`, plan.diff)],
      [
        plan.diff === '难'
          ? b('code', '难章加练', plan.title, plan.code)
          : b('meta', '周复盘', '解决/不解决什么', NOTE),
      ],
    ),
  }
}

function weekDht(n) {
  const i = n - 16
  const titles = [
    'Kademlia 论文精读',
    'XOR 距离与路由表',
    'KRPC / BEP 5 骨架',
    'find_node / get_peers',
    '接入客户端联调',
    '无 tracker 验收 + 笔记',
  ]
  return {
    focus: `DHT · ${titles[i]}`,
    must: [titles[i], i === 5 ? '去掉 tracker 仍能找 peer' : '本周有可运行 DHT 进展'],
    paths: ['Kademlia IPTPS’02', 'BEP 5', `${BT_BOOK}/05-第04章.md`, BT, BOOKS],
    ...slots(
      [b('guide', '论文/BEP', titles[i], 'Kademlia · BEP 5')],
      [b('algo', '复杂度', '为何 O(log n)', 'Erickson / 手推')],
      [b('code', 'DHT 实现', titles[i], `${BT}/src/（dht）`)],
      [b('code', '实现', '', `${BT}/src/（dht）`)],
      [b('code', '测试', '', `${BT}/tests`)],
      [b('meta', '笔记', '与 tracker 对比', NOTE)],
    ),
  }
}

function weekNat(n) {
  const i = n - 22
  const titles = [
    'NAT 类型与失败模式',
    'STUN / 打洞阅读',
    'Iroh 入门 ticket',
    '双机同网 → 跨网',
    'relay 回退验收',
  ]
  return {
    focus: `连通 · ${titles[i]}`,
    must: [titles[i], i === 4 ? '跨网演示或诚实记录走 relay' : '本周有连通实验日志'],
    paths: ['Tailscale How NAT traversal works', 'Iroh docs', 'RFC 9000 概览', BOOKS],
    ...slots(
      [b('guide', '阅读', titles[i], 'Tailscale NAT / Iroh')],
      [b('code', '实验', titles[i], 'iroh')],
      [b('code', '实验', '', 'iroh')],
      [b('guide', 'QUIC 浏览', '可选', 'RFC 9000')],
      [b('code', '修债/演示', '', 'iroh')],
      [b('meta', '笔记', '直连 vs relay', NOTE)],
    ),
  }
}

function weekGossip(n) {
  const i = n - 27
  const titles = ['epidemic/gossip 概念', '成员与广播实现', '群聊 demo 验收']
  return {
    focus: `传播 · ${titles[i]}`,
    must: [titles[i]],
    paths: ['GossipSub 规范或 epidemic 论文', 'projects/', BOOKS],
    ...slots(
      [b('guide', '论文/规范', titles[i], '')],
      [b('code', '实现', '', 'projects/')],
      [b('code', '实现', '', 'projects/')],
      [b('code', '测试', '分区/晚加入', 'projects/')],
      [b('code', '收束', '', 'projects/')],
      [b('meta', '笔记', '', NOTE)],
    ),
  }
}

function weekDs(n) {
  const i = n - 30
  if (i < 3) {
    const ch = ['DDIA 基础与模型', 'DDIA 复制/分区', 'DDIA 事务与一致性词汇'][i]
    return {
      focus: `分布式 · ${ch}`,
      must: [`精读并笔记：${ch}`, '能用自己的话讲 CAP/副本'],
      paths: ['《数据密集型应用系统设计》', 'MIT 6.5840 schedule', BOOKS],
      ...slots(
        [b('guide', 'DDIA', ch, 'DDIA')],
        [b('guide', 'DDIA', '续', 'DDIA')],
        [b('guide', '6.5840 预习', 'Raft 论文前半', 'Raft extended')],
        [b('meta', '对照', '与 BT/DHT 差异', NOTE)],
        [b('guide', 'DDIA', '习题级思考', 'DDIA')],
        [b('meta', '笔记', '', NOTE)],
      ),
    }
  }
  if (i < 9) {
    const part = ['Raft 3A 选举', 'Raft 3A 收束', 'Raft 3B 日志', 'Raft 3B 续', 'Raft 持久化入门', 'Raft 前两部验收'][
      i - 3
    ]
    return {
      focus: `分布式 lab · ${part}`,
      must: [`${part} 有进展`, '跑官方/课程测试（或等价）'],
      paths: ['https://pdos.csail.mit.edu/6.5840/', 'Raft paper', 'lab guidance'],
      ...slots(
        [b('code', 'Raft', part, '6.5840 lab')],
        [b('code', 'Raft', '实现', '6.5840 lab')],
        [b('code', 'Raft', 'debug', '6.5840 lab')],
        [b('guide', 'Students’ Guide', 'Gjengset 文按需', 'thesquareplanet.com')],
        [b('code', 'Raft', '测试加压', '6.5840 lab')],
        [b('meta', '笔记', '安全/活性', NOTE)],
      ),
    }
  }
  return {
    focus: '分布式阶段收束',
    must: ['Raft 前两部分出口 ✓', '一页：共识何时不需要'],
    paths: ['DDIA', '6.5840', NOTE],
    ...slots(
      [b('meta', '复盘', '与 P2P 主线衔接', NOTE)],
      [b('guide', 'DDIA 回看', '弱项章', 'DDIA')],
      [b('meta', '升档', '→ 数据模型', '')],
      [],
      [],
      [b('meta', '机动', '', '')],
    ),
  }
}

function weekDataSec(n) {
  const i = n - 40
  const titles = [
    '内容寻址 / Merkle DAG',
    'append-only log / CRDT 入门',
    '离线笔记原型',
    '合流与冲突验收',
    '威胁模型（女巫/eclipse）',
    'Noise / 传输加密接入',
  ]
  return {
    focus: `数据与安全 · ${titles[i]}`,
    must: [titles[i]],
    paths: [
      'Kleppmann local-first',
      'IPFS 白皮书 / Hypercore 概念',
      'Noise 协议',
      'Benet IPFS reading-list',
      BOOKS,
    ],
    ...slots(
      [b('guide', '阅读', titles[i], '')],
      [b('code', '实现', titles[i], 'projects/')],
      [b('code', '实现', '', 'projects/')],
      [b('guide', '论文选读', 'self-certifying / Coral 按需', 'ipfs reading-list')],
      [b('code', '测试', '', 'projects/')],
      [b('meta', '笔记', '', NOTE)],
    ),
  }
}

function weekCapstone(n) {
  const i = n - 46
  const titles = ['选型与边界', '集成主路径', '丢包/分区测试', '打包与演示收束']
  return {
    focus: `综合 · ${titles[i]}`,
    must: [titles[i], i === 3 ? '可演示去中心小应用' : '本周集成有进展'],
    paths: ['p2panda / Iroh 示例', 'dash-chat 只读对照', NOTE, BOOKS],
    ...slots(
      [b('code', '综合', titles[i], 'projects/')],
      [b('code', '综合', '', 'projects/')],
      [b('code', '故障注入', '延迟/分区', 'projects/')],
      [b('guide', '对照', '成熟架构', 'dash-chat / p2panda')],
      [b('code', '收束', '', 'projects/')],
      [b('meta', '毕业笔记', '各层接口图', NOTE)],
    ),
  }
}

function buildWeek(w) {
  if (w <= 2) return weekCrypto(w)
  if (w <= 15) return weekBt(w)
  if (w <= 21) return weekDht(w)
  if (w <= 26) return weekNat(w)
  if (w <= 29) return weekGossip(w)
  if (w <= 39) return weekDs(w)
  if (w <= 45) return weekDataSec(w)
  return weekCapstone(w)
}

export const p2pPlan = {
  id: 'p2p',
  title: 'P2P · 专科（CS 出身）',
  subtitle: 'BRIDGE-01 已免修 · 从应用密码起 · 重 BT 与 Raft · 英语另科',
  load: '~1.5–2.5h/day（Raft 段可能更高）',
  foot: '见书单与培养方案 · 网络/异步不排表（已会）· 阶段 10 按需 · 算法仅穿插',
  subject: true,
  phases: PHASES,
  weekCount: 49,
  legend: [
    ['guide', 'Book/Paper'],
    ['code', 'Lab/Code'],
    ['algo', 'Algo'],
    ['meta', 'Meta'],
  ],
  buildWeek,
}
