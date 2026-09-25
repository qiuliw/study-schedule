<script>
  let { plan, week, selected = $bindable(null) } = $props()

  const w = $derived(plan.weeks[week - 1])
  const packed = $derived(plan.dayKeys.map((k) => plan.packDay(w[k], week)))

  function select(block, day, slot) {
    selected = { ...block, day, slot }
  }
</script>

<section class="main">
  <div class="main-head">
    <div>
      <h2>Weekly timetable</h2>
      <div class="sub">
        {w.phase.name} ｜ 第 {week - w.phase.weeks[0] + 1} /
        {w.phase.weeks[1] - w.phase.weeks[0] + 1} 周
      </div>
    </div>
    <div class="legend">
      {#each plan.legend as [type, label]}
        <span><i class="swatch {type}"></i>{label}</span>
      {/each}
    </div>
  </div>

  <div class="grid-wrap">
    <div
      class="timetable"
      style="--cols: {plan.days.length}; grid-template-columns: 72px repeat({plan.days.length}, 1fr);"
    >
      <div class="th"></div>
      {#each plan.days as d}
        <div class="th">{d}</div>
      {/each}

      {#each plan.slots as slot, si}
        <div class="time">{slot}</div>
        {#each packed as daySlots, di}
          <div class="cell">
            {#each daySlots[si] || [] as b}
              <button
                type="button"
                class="block type-{b.type}"
                class:active={selected?.title === b.title &&
                  selected?.day === plan.days[di] &&
                  selected?.slot === slot}
                onclick={() => select(b, plan.days[di], slot)}
              >
                <div class="t">{slot}</div>
                <div class="n">{b.title}</div>
                <div class="s">{b.sub}</div>
              </button>
            {/each}
          </div>
        {/each}
      {/each}
    </div>
  </div>

  {#if selected}
    <div class="detail">
      <h3>{selected.title}</h3>
      <div class="meta">
        {selected.day} · {selected.slot} · {selected.type.toUpperCase()}
      </div>
      <p>
        {selected.sub}{selected.note ? ` · ${selected.note}` : ''}
      </p>
      <p class="path"><strong>Path</strong><br /><code>{selected.path || '—'}</code></p>
    </div>
  {/if}
</section>

<style>
  .main {
    background: var(--card);
    border: 1px solid var(--line);
    box-shadow: var(--shadow);
  }
  .main-head {
    padding: 14px 16px;
    border-bottom: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    align-items: end;
  }
  h2 {
    margin: 0 0 4px;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    font-weight: 600;
  }
  .sub {
    font-size: 0.9rem;
    color: var(--muted);
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.75rem;
    color: var(--ink);
  }
  .legend span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .swatch {
    width: 10px;
    height: 10px;
    display: inline-block;
    background: var(--meta);
  }
  .swatch.guide { background: var(--guide); }
  .swatch.eng { background: var(--eng); }
  .swatch.code { background: var(--code); }
  .swatch.algo { background: var(--algo); }
  .swatch.grammar { background: var(--grammar); }
  .swatch.pron { background: var(--pron); }
  .swatch.vocab { background: var(--vocab); }
  .swatch.listen { background: var(--listen); }
  .swatch.read { background: var(--read); }
  .swatch.write { background: var(--write); }
  .swatch.speak { background: var(--speak); }
  .swatch.test { background: var(--test); }
  .swatch.meta { background: var(--meta); }
  .swatch.core { background: #64748b; }

  .grid-wrap {
    overflow-x: auto;
  }
  .timetable {
    min-width: 760px;
    display: grid;
    border-top: 1px solid var(--line);
  }
  .th,
  .time,
  .cell {
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    min-height: 92px;
  }
  .th:last-child,
  .cell:last-child {
    border-right: none;
  }
  .th {
    min-height: 40px;
    background: #f3f1eb;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    color: var(--ink);
  }
  .time {
    background: #fafaf7;
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--muted);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 10px;
  }
  .cell {
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 22px,
      rgba(0, 0, 0, 0.015) 22px,
      rgba(0, 0, 0, 0.015) 23px
    );
  }
  .block {
    border: none;
    border-left: 4px solid var(--ink);
    background: #f4f5f7;
    padding: 7px 8px;
    cursor: pointer;
    text-align: left;
    font: inherit;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    color: var(--ink);
  }
  .block:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(11, 12, 14, 0.08);
  }
  .block.active {
    outline: 2px solid var(--ink);
    outline-offset: 1px;
  }
  .t {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--muted);
    margin-bottom: 2px;
  }
  .n {
    font-size: 0.82rem;
    font-weight: 600;
    line-height: 1.25;
  }
  .s {
    margin-top: 3px;
    font-size: 0.72rem;
    color: var(--muted);
    line-height: 1.3;
  }
  .type-grammar { border-color: var(--grammar); background: #eef4fa; }
  .type-pron { border-color: var(--pron); background: #eaf7f3; }
  .type-vocab { border-color: var(--vocab); background: #f4eefb; }
  .type-listen { border-color: var(--listen); background: #fbf1eb; }
  .type-read { border-color: var(--read); background: #eef7f0; }
  .type-write { border-color: var(--write); background: #f8f1e9; }
  .type-speak { border-color: var(--speak); background: #f9eef2; }
  .type-test { border-color: var(--test); background: #eef1f5; }
  .type-meta { border-color: var(--meta); background: #f3f4f6; }
  .type-guide { border-color: var(--guide); background: #f8ecee; }
  .type-core { border-color: #64748b; background: #f1f5f9; }
  .type-eng { border-color: var(--eng); background: #eef4fa; }
  .type-code { border-color: var(--code); background: #e8f5f0; }
  .type-algo { border-color: var(--algo); background: #f4eefb; }

  .detail {
    margin: 0 16px 16px;
    border: 1px solid var(--line);
    padding: 14px;
    background: #fafaf7;
  }
  .detail h3 {
    margin: 0 0 6px;
    font-family: var(--serif);
    font-size: 1.1rem;
    color: var(--ink);
  }
  .meta {
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .detail p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.92rem;
    color: var(--ink);
  }
  .path {
    margin-top: 10px !important;
  }
  .path code {
    font-family: var(--mono);
    font-size: 0.8rem;
    word-break: break-all;
  }
</style>
