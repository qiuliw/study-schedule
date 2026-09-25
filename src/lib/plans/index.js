import { compilePlan, buildAllView, ALL_VIEW_ID } from '../schedule/model.js'
import { ieltsPlan } from './ielts.js'
import { p2pPlan } from './p2p.js'
import { templatePlan } from './template.js'

/** Subject plans (shown alone or stacked in 全部). */
const subjectDefs = [ieltsPlan, p2pPlan]

/** Extra plans (alone only — not in 全部). */
const extraDefs = [templatePlan]

export const subjectPlans = subjectDefs.map(compilePlan)
export const extraPlans = extraDefs.map(compilePlan)
export const allView = buildAllView(subjectPlans)

/** Dropdown / chip list: 全部 first, then subjects, then extras. */
export const plans = [allView, ...subjectPlans, ...extraPlans]

export { ALL_VIEW_ID }

export function getPlan(id) {
  return plans.find((p) => p.id === id) ?? allView
}
