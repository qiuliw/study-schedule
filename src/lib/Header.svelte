<script>
  let {
    plan,
    plans = [],
    planId = 'all',
    week = 1,
    onPlanId,
    onWeek,
  } = $props()

  function clampWeek(w) {
    onWeek?.(w)
  }

  function tabLabel(p) {
    if (p.id === 'all') return '全部'
    if (p.id === 'ielts') return '英语'
    if (p.id === 'p2p') return 'P2P'
    if (p.id === 'template') return '模板'
    return p.title
  }
</script>

<header class="top">
  <div class="top-inner">
    <div class="brand">
      <div>
        <h1>{plan.title}</h1>
        {#if plan.subtitle}
          <p>{plan.subtitle}</p>
        {/if}
      </div>
      <div class="stats">
        <div class="pill">TERM <strong>{plan.weeks[week - 1].phase.id}</strong></div>
        <div class="pill">
          WEEK <strong>{String(week).padStart(2, '0')}</strong> / {plan.weekCount}
        </div>
        <div class="pill">LOAD <strong>{plan.load}</strong></div>
      </div>
    </div>

    <div class="subject-tabs" role="tablist" aria-label="科目">
      {#each plans as p}
        <button
          type="button"
          role="tab"
          class:active={p.id === planId}
          aria-selected={p.id === planId}
          onclick={() => onPlanId?.(p.id)}
        >
          {tabLabel(p)}
        </button>
      {/each}
    </div>

    <div class="controls">
      <button type="button" onclick={() => clampWeek(week - 1)}>← Prev</button>
      <label>
        Week
        <input
          type="number"
          min="1"
          max={plan.weekCount}
          value={week}
          onchange={(e) => clampWeek(e.currentTarget.value)}
        />
      </label>
      <button type="button" onclick={() => clampWeek(week + 1)}>Next →</button>
      {#if plan.phases.length > 1}
        <label class="jump">
          Jump phase
          <select
            value={String(
              plan.phases.find((p) => p.id === plan.weeks[week - 1].phase.id)?.weeks[0] ?? 1,
            )}
            onchange={(e) => clampWeek(e.currentTarget.value)}
          >
            {#each plan.phases as p}
              <option value={p.weeks[0]}>
                {p.name} (W{String(p.weeks[0]).padStart(2, '0')}–{p.weeks[1]})
              </option>
            {/each}
          </select>
        </label>
      {/if}
    </div>

    {#if plan.phases.length > 1}
      <div class="phase-tabs">
        {#each plan.phases as p}
          <button
            type="button"
            class:active={p.id === plan.weeks[week - 1].phase.id}
            onclick={() => clampWeek(p.weeks[0])}
          >
            {p.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</header>

<style>
  .top {
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(247, 246, 242, 0.92);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--line);
  }
  .top-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 18px 20px 14px;
    display: grid;
    gap: 14px;
  }
  .brand {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  h1 {
    margin: 0;
    font-family: var(--serif);
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    letter-spacing: -0.02em;
    font-weight: 700;
    color: var(--ink);
  }
  .brand p {
    margin: 4px 0 0;
    color: var(--muted);
    font-size: 0.92rem;
    white-space: pre-line;
  }
  .stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }
  .pill {
    border: 1px solid var(--line);
    background: var(--card);
    padding: 6px 10px;
    font-size: 0.78rem;
    font-family: var(--mono);
    box-shadow: var(--shadow);
    color: var(--ink);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .pill strong {
    color: var(--mit-red);
  }
  .subject-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .subject-tabs button {
    border: 1px solid var(--line);
    background: var(--card);
    padding: 8px 14px;
    font-size: 0.88rem;
    cursor: pointer;
    color: var(--ink);
    box-shadow: var(--shadow);
  }
  .subject-tabs button.active {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
  .controls button,
  .controls select,
  .controls input {
    font: inherit;
    border: 1px solid var(--line);
    background: var(--card);
    padding: 8px 12px;
    cursor: pointer;
    box-shadow: var(--shadow);
    color: var(--ink);
  }
  .controls label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.86rem;
    color: var(--muted);
  }
  .jump {
    margin-left: auto;
  }
  .phase-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .phase-tabs button {
    border: 1px solid var(--line);
    background: transparent;
    padding: 6px 10px;
    font-size: 0.78rem;
    cursor: pointer;
    color: var(--ink);
  }
  .phase-tabs button.active {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
  }
</style>
