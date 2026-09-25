<script>
  let {
    plan,
    week,
    checks = $bindable({}),
  } = $props()

  const w = $derived(plan.weeks[week - 1])

  function key(i) {
    return `${week}:${i}`
  }

  function toggle(i, checked) {
    checks = { ...checks, [key(i)]: checked }
  }
</script>

<aside class="side">
  <h2>Week brief</h2>
  <div class="week-title">Week {week} · Term {w.phase.id}</div>
  <p class="focus">{w.focus}</p>
  <div class="exit">
    <strong>{w.phase.name}</strong> · 出口：{w.phase.exit}
  </div>
  <h2>Must finish</h2>
  <ul class="checklist">
    {#each w.must as item, i}
      <li>
        <input
          type="checkbox"
          checked={!!checks[key(i)]}
          onchange={(e) => toggle(i, e.currentTarget.checked)}
        />
        <span>{item}</span>
      </li>
    {/each}
  </ul>
  <div class="path">{w.paths.join('\n')}</div>
</aside>

<style>
  .side {
    background: var(--card);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
    padding: 16px;
  }
  h2 {
    margin: 0 0 8px;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    font-weight: 600;
  }
  .week-title {
    font-family: var(--serif);
    font-size: 1.35rem;
    margin: 0 0 6px;
    color: var(--ink);
  }
  .focus {
    color: var(--ink);
    line-height: 1.45;
    margin: 0 0 14px;
    font-size: 0.95rem;
    white-space: pre-line;
  }
  .exit {
    border-left: 3px solid var(--mit-red);
    padding: 8px 10px;
    background: #faf6f6;
    font-size: 0.86rem;
    margin-bottom: 14px;
    color: var(--ink);
  }
  .checklist {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 8px;
  }
  .checklist li {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 8px;
    align-items: start;
    font-size: 0.88rem;
    line-height: 1.35;
    color: var(--ink);
  }
  .checklist input {
    margin-top: 2px;
  }
  .path {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    font-size: 0.8rem;
    color: var(--muted);
    font-family: var(--mono);
    line-height: 1.5;
    word-break: break-all;
    white-space: pre-wrap;
  }
</style>
