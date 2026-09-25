import { block } from '../schedule/model.js'

/**
 * Stub plan — copy this file to add a new learning track.
 * Register it in `./index.js`.
 */
export const templatePlan = {
  id: 'template',
  title: 'New Plan (template)',
  subtitle: '复制 plans/template.js → 改 id/title/phases/buildWeek，再登记到 index.js',
  load: '~1h/day',
  foot: '这是占位计划，用来演示如何接入新课表。',
  phases: [
    { id: 'A', name: 'A 起步', weeks: [1, 2], exit: '习惯周节奏' },
    { id: 'B', name: 'B 展开', weeks: [3, 4], exit: '换成你的真实阶段' },
  ],
  weekCount: 4,
  dailyCore() {
    return [block('core', '每日固定', '换成本计划的日常项', '', '')]
  },
  buildWeek(n) {
    return {
      focus: `模板第 ${n} 周：在这里写本周重点`,
      must: ['改成你的 checklist', '绑定真实资料路径'],
      paths: ['path/to/materials'],
      mon: [block('guide', '主题课', '第 1 段', 'path/to/lesson')],
      tue: [block('guide', '主题课', '第 2 段', 'path/to/lesson')],
      wed: [block('meta', '练习', '动手/笔记', '')],
      thu: [block('guide', '主题课', '第 3 段', 'path/to/lesson')],
      fri: [block('guide', '主题课', '第 4 段', 'path/to/lesson')],
      sat: [block('meta', '周复盘', '30min', '')],
    }
  },
}
