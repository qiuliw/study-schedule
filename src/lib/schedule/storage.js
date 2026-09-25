const PREFIX = 'study-schedule'

function key(planId, name) {
  return `${PREFIX}:${planId}:${name}`
}

export function loadWeek(planId, fallback = 1) {
  const n = Number(localStorage.getItem(key(planId, 'week')) || fallback)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function saveWeek(planId, week) {
  localStorage.setItem(key(planId, 'week'), String(week))
}

export function loadChecks(planId) {
  try {
    return JSON.parse(localStorage.getItem(key(planId, 'checks')) || '{}')
  } catch {
    return {}
  }
}

export function saveChecks(planId, checks) {
  localStorage.setItem(key(planId, 'checks'), JSON.stringify(checks))
}

export function loadActivePlanId(fallback) {
  return localStorage.getItem(`${PREFIX}:activePlan`) || fallback
}

export function saveActivePlanId(planId) {
  localStorage.setItem(`${PREFIX}:activePlan`, planId)
}
