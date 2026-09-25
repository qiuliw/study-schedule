# Study Schedule

通用 MIT 式周历课表（Svelte + Vite）。**框架与课程解耦**：UI 只吃 `Plan`，具体学习内容放在 `src/lib/plans/`。

## 跑起来

```sh
cd /home/qiuliw/projects/study-schedule
nix develop
npm install
npm run dev
```

## 加一门新课表

1. 复制 `src/lib/plans/template.js` → `src/lib/plans/your-plan.js`
2. 改 `id` / `title` / `phases` / `buildWeek`（可选 `dailyCore`）
3. 在 `src/lib/plans/index.js` 里 `import` 并加入 `defs`

```js
// buildWeek(n) 返回：
{
  focus: '本周一句话',
  must: ['勾选项'],
  paths: ['资料路径'],
  mon: [block('guide', '标题', '副标题', 'path')],
  tue: [...], // wed thu fri sat 同理；dayKeys 可自定义
}
```

`block(type, title, sub?, path?, note?)` 从 `src/lib/schedule/model.js` 引入。

## 目录

```
src/lib/schedule/     # 框架：模型、打包格子、localStorage
src/lib/plans/        # 课程包：ielts、template、…
src/lib/*.svelte      # 纯展示
```

当前已接入：`ielts`（52 周主梯）、`template`（占位示例）。
