<script>
  import Header from './lib/Header.svelte'
  import Sidebar from './lib/Sidebar.svelte'
  import Timetable from './lib/Timetable.svelte'
  import { plans, getPlan, ALL_VIEW_ID } from './lib/plans/index.js'
  import {
    loadActivePlanId,
    saveActivePlanId,
    loadWeek,
    saveWeek,
    loadChecks,
    saveChecks,
  } from './lib/schedule/storage.js'

  const initialId = loadActivePlanId(ALL_VIEW_ID)
  const resolvedInitial = getPlan(initialId).id

  let planId = $state(resolvedInitial)
  let week = $state(loadWeek(resolvedInitial, 1))
  let checks = $state(loadChecks(resolvedInitial))
  let selected = $state(null)

  const plan = $derived(getPlan(planId))

  $effect(() => {
    saveActivePlanId(planId)
  })

  $effect(() => {
    saveWeek(planId, week)
  })

  $effect(() => {
    saveChecks(planId, checks)
  })

  function switchPlan(id) {
    if (id === planId) return
    planId = id
    week = Math.min(getPlan(id).weekCount, loadWeek(id, 1))
    checks = loadChecks(id)
    selected = null
  }
</script>

<Header
  {plan}
  {plans}
  {planId}
  {week}
  onPlanId={switchPlan}
  onWeek={(w) => {
    week = Math.min(plan.weekCount, Math.max(1, Number(w) || 1))
    selected = null
  }}
/>

<div class="layout">
  <Sidebar {plan} {week} bind:checks />
  <Timetable {plan} {week} bind:selected />
</div>

{#if plan.foot}
  <p class="foot">{plan.foot}</p>
{/if}

<style>
  .layout {
    max-width: 1280px;
    margin: 0 auto;
    padding: 18px 20px 24px;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 18px;
  }
  @media (max-width: 960px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
  .foot {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px 40px;
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.5;
  }
</style>
