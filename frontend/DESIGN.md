---
name: 极简工坊
description: 多作者中文技术写作平台 — 中性灰阶 + 四色点缀的克制设计系统
colors:
  page-bg: '#ffffff'
  surface-bg: '#f6f6f7'
  stroke: '#e9e9eb'
  stroke-strong: '#d6d6d9'
  heading: '#1f1f23'
  body: '#52525b'
  muted: '#71717a'
  faint: '#71717a'
  accent: '#09090b'
  ink-tint: '#90a1ba'
  ink-base: '#4a6fa5'
  ember-tint: '#d7aa7e'
  ember-base: '#b07238'
  crimson-tint: '#ce8888'
  crimson-base: '#b84238'
  slate-tint: '#789385'
  slate-base: '#437d61'
  state-info: '#4a6fa5'
  state-success: '#437d61'
  state-warning: '#b07238'
  state-error: '#b84238'
typography:
  display:
    fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif'
    fontSize: 'clamp(40px, 5.6vw, 68px)'
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: '-0.035em'
  headline:
    fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif'
    fontSize: '28px'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif'
    fontSize: '20px'
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif'
    fontSize: '12px'
    fontWeight: 600
    letterSpacing: '0.06em'
  mono:
    fontFamily: 'ui-monospace, SF Mono, Menlo, Consolas, monospace'
    fontSize: '14px'
    fontWeight: 400
rounded:
  xs: '4px'
  sm: '6px'
  md: '8px'
  lg: '10px'
  xl: '12px'
  2xl: '16px'
spacing:
  0: '0px'
  1: '4px'
  2: '8px'
  3: '12px'
  4: '16px'
  5: '20px'
  6: '24px'
  7: '32px'
  8: '40px'
  9: '48px'
  10: '64px'
  11: '80px'
  12: '96px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.page-bg}'
    rounded: '{rounded.lg}'
  button-primary-hover:
    backgroundColor: 'color-mix(in srgb, {colors.accent} 88%, {colors.page-bg})'
  button-ghost:
    backgroundColor: '{colors.surface-bg}'
    textColor: '{colors.body}'
    rounded: '{rounded.lg}'
  button-ghost-hover:
    backgroundColor: '{colors.stroke}'
    textColor: '{colors.heading}'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.body}'
    rounded: '{rounded.lg}'
  button-danger:
    backgroundColor: '{colors.state-error}'
    textColor: '{colors.page-bg}'
    rounded: '{rounded.lg}'
  card:
    backgroundColor: '{colors.surface-bg}'
    rounded: '{rounded.xl}'
  chip:
    backgroundColor: 'color-mix(in srgb, {colors.heading} 12%, {colors.surface-bg})'
    textColor: '{colors.heading}'
    rounded: '9999px'
  input-field:
    backgroundColor: '{colors.page-bg}'
    textColor: '{colors.body}'
    rounded: '{rounded.lg}'
  tag-ink:
    backgroundColor: 'color-mix(in srgb, {colors.ink-tint} 18%, {colors.surface-bg})'
    textColor: '{colors.ink-base}'
    rounded: '9999px'
  tag-ember:
    backgroundColor: 'color-mix(in srgb, {colors.ember-tint} 18%, {colors.surface-bg})'
    textColor: '{colors.ember-base}'
    rounded: '9999px'
  tag-crimson:
    backgroundColor: 'color-mix(in srgb, {colors.crimson-tint} 18%, {colors.surface-bg})'
    textColor: '{colors.crimson-base}'
    rounded: '9999px'
  tag-slate:
    backgroundColor: 'color-mix(in srgb, {colors.slate-tint} 18%, {colors.surface-bg})'
    textColor: '{colors.slate-base}'
    rounded: '9999px'
---

# Design System: 极简工坊

## Overview

**Creative North Star: "极简工坊"**

这是一个像干净手工作坊的设计系统:工具就位,表面中性,点缀色只在状态时出现。中性灰阶承担 95% 的视觉,四色点缀(ink/ember/crimson/slate)仅在标签、状态提示、分类着色时作为信号出现。整体气质是工程克制——每个视觉元素都要有理由,装饰为内容让路。

双声部字体架构:Inter + Noto Sans SC 的无衬线体统一承担标题、正文和 UI,保证一致的可读性与工程感;系统等宽字体(ui-monospace / SF Mono / Menlo)用于代码,是工程身份的体现。通过字重(700/600/500/400)和字号尺度(11–48px 共 12 档)区分层级,行高与字距独立校准。

明暗双主题不是简单反色——暗色主题对灰阶、点缀色、阴影透明度都做了独立校准,确保两套主题下对比度均达 WCAG AA。4px 网格统一全站间距节奏。

**Key Characteristics:**

- 中性灰阶为主,四色点缀仅作信号
- 双声部字体:sans 正文+标题 / mono 代码
- 明暗双主题独立校准对比度
- 4px 间距网格,12 档字号尺度
- 克制的阴影系统(3 档,明暗透明度不同)
- 圆角尺度 6 档(4–16px),卡片用 xl(12px)

## Colors

中性灰阶是 backbone,四色点缀是信号灯。

### Primary

- **墨黑 Accent** (#09090b):按钮实心底色、激活态、焦点轮廓。全站唯一的"重音色",使用面积 ≤10%。

### Tertiary(状态与分类着色)

- **靛蓝 Ink** (#4a6fa5 / #90a1ba):信息状态、技术分类标签。冷调,工程感。
- **赭石 Ember** (#b07238 / #d7aa7e):警告状态、生活分类标签。暖调,大地色。
- **绛红 Crimson** (#b84238 / #ce8888):错误状态、删除操作、Mac 窗口红点。最强信号色。
- **苔绿 Slate** (#437d61 / #789385):成功状态、自然分类标签。平静的确认色。

### Neutral

- **纸白 Page** (#ffffff):页面底色(亮色主题)。
- **表面 Surface** (#f6f6f7):卡片、输入框底色。
- **描边 Stroke** (#e9e9eb):分隔线、卡片边框。
- **强描边 Stroke Strong** (#d6d6d9):输入框边框、hover 强化。
- **标题 Heading** (#1f1f23):标题文字。
- **正文 Body** (#52525b):正文文字。
- **弱化 Muted** (#71717a):元信息、辅助文字。
- **极弱 Faint** (#71717a):占位符、最小辅助文字。

**The 信号灯 Rule.** 四色点缀只用于状态和分类标记,永不用于装饰或大面积背景。它们是信号灯,不是涂料。

**The 对比度 Rule.** 正文与背景对比 ≥4.5:1。在浅色卡片(#f6f6f7)上,正文用 Body(#52525b)而非正文灰阶最浅档。

## Typography

**Primary Font:** Inter + Noto Sans SC (system-ui fallback) — 标题、正文、UI 统一使用
**Mono Font:** ui-monospace, SF Mono, Menlo, Consolas (系统等宽) — 代码与数据

**Character:** 无衬线体保证 UI 清晰度与一致性,通过字重(700/600/500/400)区分层级而非字体切换。等宽体用于代码,是工程身份印章。标题与正文使用同一字体族,依靠字号与字重拉开层次。

### Hierarchy

- **Display** (600, clamp(40–68px), 1.05, -0.035em):首页 Hero 主标题。仅此一处。
- **Headline** (700, 28px, 1.25, -0.02em):页面主标题。
- **Title** (600, 20px, 1.35):区块标题。
- **Subtitle** (600, 17px, 1.35):卡片标题、次级标题。
- **Body** (400, 14–16px, 1.6):正文。阅读体验是核心,行宽 65–75ch。
- **Meta** (400, 12–13px, 1.5–1.7):元信息、辅助文字、标签。
- **Label** (600, 11–12px, 0.06em):表单标签、筛选标题(小型大写)。

**The 字重分层 Rule.** 标题与正文使用同一字体族(Inter + Noto Sans SC),通过字重(700/600/500/400)和字号拉开层级。代码使用系统等宽字体,不使用外部加载的 mono 字体。

**The 行宽 Rule.** 文章正文行宽 65–75ch。超过这个范围阅读疲劳,低于这个范围节奏断裂。

## Layout

4px 网格统一全站。间距尺度 13 档(0–96px),页面主区域 py-12(48px)移动端 py-8(32px)。

容器最大宽度分三档:

- 文章内容 780px(阅读最优行宽)
- Auth 表单 440px(单列聚焦)
- 页面主区域容器宽度由 Container 组件控制

响应式断点:移动端 max-md(768px)。移动端策略是收窄间距、折叠导航、单列布局,不做功能删减。

**The 4px Rule.** 所有间距值是 4 的倍数。例外仅限 0.5(2px)和 1.5(6px)的微调。

## Elevation & Depth

克制的高程系统。3 档阴影,明暗主题透明度不同——亮色主题阴影淡(0.05–0.09),暗色主题阴影深(0.36–0.52)。

### Shadow Vocabulary

- **Shadow xs** (`0 1px 2px rgb(0 0 0 / opacity-sm)`):开关、分段控件选中态的内阴影。
- **Shadow sm** (`0 1px 3px ..., 0 1px 2px ...`):卡片 hover、输入框聚焦的微提升。
- **Shadow md** (`0 4px 12px ..., 0 2px 4px ...`):悬浮卡片、下拉菜单。
- **Shadow lg** (`0 12px 32px ..., 0 4px 12px ...`):Auth 卡片、Modal 弹窗。

**The 状态阴影 Rule.** 阴影是状态的响应,不是默认装饰。静止表面是平的;hover、聚焦、悬浮才出现阴影。

## Shapes

圆角 6 档:xs(4px)用于徽章,sm(6px)用于小标签,md(8px)用于输入框和图标按钮,lg(10px)用于按钮和分段控件,xl(12px)用于卡片,2xl(16px)用于 Auth 卡片和代码窗口。

胶囊形(9999px)用于 chip、tag、头像。全站没有直角元素。

**The 圆角分层 Rule.** 元素层级越高,圆角越大。徽章 4px < 输入框 8px < 卡片 12px < 弹窗 16px。

## Components

### Buttons

- **Shape:** 圆角 lg(10px),高度 40px(h-10)或 44px(h-11)。
- **Primary:** Accent 实心底 + 白字。hover 时混入 12% 白色提亮 + 发光阴影。active 时加深。
- **Ghost:** Surface 底 + Body 字。hover 时背景变 Stroke、字色变 Heading。最常用的次级按钮。
- **Outline:** 透明底 + Stroke Strong 边框 + Body 字。hover 时出 Surface 底。
- **Danger:** Error 浅底 + Error 字。hover 时加深 + 红色发光阴影。仅用于删除。
- **状态:** 所有按钮 disabled 时 opacity 0.5 + not-allowed。focus 由全局 :focus-visible 接管。

### Chips & Tags

- **Chip:** 胶囊形,12% Heading 混色底 + inset 1px Stroke 边框。用于分类、状态标记。
- **Badge:** 方角 sm(6px),同 Chip 配方但更紧凑。用于 ArticleCard 标签列表。
- **Tag(四色):** 胶囊形,18% tint 底 + base 字色。按分类映射四色。是唯一的彩色元素出口。
- **State:** Tag hover 时加深底色、加粗边框。

### Cards

- **Corner:** xl(12px)。
- **Background:** Surface(#f6f6f7)。
- **Border:** 1px Stroke(#e9e9eb)。
- **Shadow Strategy:** 静止时无边框阴影;hover 时背景变 Page(白)、边框变 Stroke Strong、出 Shadow sm。
- **Padding:** 页面区块 py-12,卡片内部 p-5–p-6。

### Inputs

- **Style:** 1px Stroke Strong 边框 + Page 底色 + Body 字。圆角 md(8px),高度 h-11(44px)。
- **Focus:** 边框变 Accent,150ms 过渡。无发光环(边框即焦点)。
- **Error:** 边框变 Error 红,!important 确保 focus 不覆盖。
- **Disabled:** opacity 0.5 + not-allowed。

### Navigation

- **Desktop:** 固定顶部,毛玻璃背景(blur 18px + saturate 160%),高度 64px。
- **Mobile:** 折叠菜单,实心毛玻璃(blur 16px),用 inert 防焦点泄漏。
- **Active:** Accent 底 + 白字。
- **Inactive:** 透明底,hover 出 Surface 底。

## Do's and Don'ts

### Do:

- **Do** 保持中性灰阶为主,四色点缀仅用于状态和分类信号。
- **Do** 用 Body(#52525b)作为正文色,不用 Muted。
- **Do** 让阴影响应状态(hover/focus),而非默认出现。
- **Do** 用字重和字号区分标题与正文层级(同一字体族)。
- **Do** 在暗色主题下独立校准对比度,不依赖简单反色。
- **Do** 用 4px 网格控制间距节奏。

### Don't:

- **Don't** 用四色点缀做装饰背景或大面积色块——它们是信号灯,不是涂料。
- **Don't** 在浅色卡片(#f6f6f7)上用 Muted(#71717a)做正文——对比度只有 4.47,未达 4.5。
- **Don't** 给静止卡片加阴影——阴影是 hover 的响应。
- **Don't** 使用 serif 字体——全站统一 sans-serif,通过字重区分层级。
- **Don't** 使用 eyebrow/kicker(标题上方的小型大写标签)——标题自身应承担重量。
- **Don't** 堆叠同尺寸卡片(icon + heading + text)作为页面结构——这是 lazy container。
- **Don't** 用 emoji 或 Unicode 字符代替图标——图标必须来自真实库(lucide-react)。
- **Don't** 使用 gradient text 做强调——强调来自 weight 或 size。
