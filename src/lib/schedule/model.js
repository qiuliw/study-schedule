/**
 * Schedule framework — plan-agnostic helpers.
 *
 * A Plan is a plain object:
 * {
 *   id, title, subtitle?, load?, foot?,
 *   days?, dayKeys?, slots?, legend?,
 *   phases: [{ id, name, weeks:[from,to], exit }],
 *   weekCount?,                    // default = max phase end
 *   buildWeek(n) -> Week,          // required
 *   dailyCore?(n) -> Block[],      // optional, injected into empty slots
 * }
 *
 * Week: { focus, must[], paths[], mon..sun?: Block[], phase?, week? }
 * Block: { type, title, sub?, path?, note? }
 */

export const DEFAULT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const DEFAULT_DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const DEFAULT_SLOTS = ['19:00', '19:50', '20:40']

export const DEFAULT_LEGEND = [
  ['guide', 'Guide'],
  ['grammar', 'Grammar'],
  ['pron', 'Pron'],
  ['vocab', 'Vocab'],
  ['listen', 'Listen'],
  ['read', 'Read'],
  ['write', 'Write'],
  ['speak', 'Speak'],
  ['test', 'Test'],
  ['meta', 'Meta'],
  ['core', 'Core'],
]

/** @param {string} type @param {string} title @param {string} [sub] @param {string} [path] @param {string} [note] */
export function block(type, title, sub = '', path = '', note = '') {
  return { type, title, sub, path, note }
}

export function phaseFor(phases, week) {
  return phases.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) ?? phases[0]
}

export function weekCountOf(plan) {
  if (plan.weekCount) return plan.weekCount
  return Math.max(...plan.phases.map((p) => p.weeks[1]))
}

/**
 * Fill timetable slots: main blocks first, then dailyCore into remaining slots.
 * @param {object[]} main
 * @param {object[]} core
 * @param {number} slotCount
 */
export function packSlots(main = [], core = [], slotCount = 3) {
  const out = Array.from({ length: slotCount }, () => [])
  const queue = [...main, ...core]
  let i = 0
  for (const b of queue) {
    if (i >= slotCount) break
    out[i].push(b)
    i += 1
  }
  // If main left extras, append into last used / last slot
  if (main.length > slotCount) {
    for (let j = slotCount; j < main.length; j++) out[slotCount - 1].push(main[j])
  }
  return out
}

/** Compile a plan definition into runtime data the UI consumes. */
export function compilePlan(def) {
  const days = def.days ?? DEFAULT_DAYS
  const dayKeys = def.dayKeys ?? DEFAULT_DAY_KEYS
  const slots = def.slots ?? DEFAULT_SLOTS
  const legend = def.legend ?? DEFAULT_LEGEND
  const weekCount = weekCountOf(def)

  const weeks = Array.from({ length: weekCount }, (_, i) => {
    const n = i + 1
    const w = def.buildWeek(n)
    return {
      ...w,
      week: n,
      phase: phaseFor(def.phases, n),
      must: w.must ?? [],
      paths: (w.paths ?? []).filter(Boolean),
    }
  })

  return {
    id: def.id,
    title: def.title,
    subtitle: def.subtitle ?? '',
    load: def.load ?? '~1.5–2h/day',
    foot: def.foot ?? '',
    subject: !!def.subject,
    days,
    dayKeys,
    slots,
    legend,
    phases: def.phases,
    weekCount,
    weeks,
    packDay(dayBlocks, weekNum) {
      const core = typeof def.dailyCore === 'function' ? def.dailyCore(weekNum) : []
      return packSlots(dayBlocks ?? [], core ?? [], slots.length)
    },
  }
}

export const ALL_VIEW_ID = 'all'

function shortLabel(plan) {
  if (plan.id === 'ielts') return '英'
  if (plan.id === 'p2p') return 'P2P'
  return plan.id.slice(0, 4)
}

/**
 * Overlay subject plans for the same week number (not a mixed curriculum).
 * Each block is tagged [英]/[P2P] so subjects stay visually separate.
 */
export function buildAllView(subjectPlans) {
  if (!subjectPlans.length) {
    throw new Error('buildAllView: no subject plans')
  }

  const days = subjectPlans[0].days
  const dayKeys = subjectPlans[0].dayKeys
  const weekCount = Math.max(...subjectPlans.map((p) => p.weekCount))
  const slots = ['A', 'B', 'C', 'D', 'E', 'F']

  const legendMap = new Map()
  for (const p of subjectPlans) {
    for (const [type, label] of p.legend) legendMap.set(type, label)
  }

  const phases = [
    {
      id: 'ALL',
      name: '全部 · 公共周次',
      weeks: [1, weekCount],
      exit: '切到单科查看各科阶段出口与专属周历',
    },
  ]

  const weeks = Array.from({ length: weekCount }, (_, i) => {
    const n = i + 1
    const parts = subjectPlans.map((p) => {
      const wn = Math.min(n, p.weekCount)
      return { plan: p, w: p.weeks[wn - 1], wn }
    })

    const dayData = {}
    for (const key of dayKeys) {
      const blocks = []
      for (const { plan: p, w, wn } of parts) {
        const packed = p.packDay(w[key] ?? [], wn)
        const tag = shortLabel(p)
        for (const b of packed.flat()) {
          blocks.push({
            ...b,
            title: `[${tag}] ${b.title}`,
            note: [b.note, p.title].filter(Boolean).join(' · '),
          })
        }
      }
      dayData[key] = blocks
    }

    return {
      week: n,
      phase: phases[0],
      focus: parts.map(({ plan: p, w }) => `[${shortLabel(p)}] ${w.focus}`).join('\n'),
      must: parts.flatMap(({ plan: p, w }) =>
        (w.must ?? []).map((m) => `[${shortLabel(p)}] ${m}`),
      ),
      paths: parts.flatMap(({ w }) => w.paths ?? []),
      ...dayData,
    }
  })

  return {
    id: ALL_VIEW_ID,
    title: '全部科目',
    subtitle: '同周叠加显示各科（格子带科目标签）；单科请切回英语 / P2P',
    load: subjectPlans.map((p) => p.load).join(' + '),
    foot: subjectPlans
      .map((p) => p.foot)
      .filter(Boolean)
      .join(' · '),
    subject: false,
    days,
    dayKeys,
    slots,
    legend: [...legendMap.entries()],
    phases,
    weekCount,
    weeks,
    packDay(dayBlocks) {
      const list = dayBlocks ?? []
      return packSlots(list, [], Math.max(slots.length, list.length || 1))
    },
  }
}
