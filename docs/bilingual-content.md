# 双语内容维护

## 文字维护位置

同一项内容的中文和日文放在同一份文件中，按下表查找即可：

| 要修改的内容 | 唯一维护文件 | 中文与日文的位置 |
| --- | --- | --- |
| 网站总标题、语言名称与「中 / 日」按钮 | [languages.yaml](../blog/config/_default/languages.yaml) | `zh` 和 `jp` 两段配置 |
| 按钮、分页、目录及待机猫提示文字 | [interface.yaml](../blog/data/interface.yaml) | `zh` 和 `jp` 两段文字 |
| 年龄、生日、喜欢 | [basic-info.md](../blog/content/sidebar/basic-info.md) | 中文正文在上，日文正文在下 |
| 左侧个人简介 | [bio.md](../blog/content/sidebar/bio.md) | 中文正文在上，日文正文在下 |
| 左侧链接名称、链接地址与共用头像 | [sidebar/_index.md](../blog/content/sidebar/_index.md) | 名称按 `translations.zh/jp` 区分；共用值放顶层 |
| 文章标题、封面、摘要和正文 | 每篇自己的 [posts/](../blog/content/posts/) 下的 MD | 标题与图片说明放 `translations.zh/jp`；正文上下分段 |
| 动态标题和正文 | 每条自己的 [moments/](../blog/content/moments/) 下的 MD | 标题放 `translations.zh/jp`；正文上下分段 |
| 栏目页面标题 | 对应目录的 `_index.md` | `translations.zh.title` 和 `translations.jp.title`，同时用于首页栏目、列表标题和文章返回链接 |

网站标题与界面短文字使用双语 YAML，文章和侧栏正文使用双语 Markdown。技术配置（域名、主题、开关、分页条数）保留在 `blog/hugo.yaml`；不需要再到两份语言文件中分别修改同一项内容。

`interface.yaml` 中，每个文字键在 `zh`、`jp` 下各有一个值。缺少某项日文时回退到中文；两种语言都缺少该项时构建会报错，避免发布空按钮。

## 内容规则

- [blue-paw-diary.md](../blog/content/posts/blue-paw-diary.md) 是现有双语示例文章。普通段落、标题、列表、引用与图片直接使用 Markdown；正文图片写成 `![说明](/icon.png?v=2065db7cd551)`。
- `cover` 是列表封面地址，`cover_alt` 是各语言的图片说明；正文图片独立放在各自语言的正文中，可共用同一个图片文件。
- 当前只保留猫爪与蓝色配色，颜色和背景在 `blog/data/custom_themes.yaml` 中调整；没有主题切换、标签分类、视频短代码或旧图库组件。


- 首页的「喵喵动态」和「喵喵记录」各展示最新两条，右上角的「查看更多」进入对应列表。
- 短动态放在 `blog/content/moments/`，展示时间和当前语言的 Markdown 全文，不显示标签。动态列表每页两条，不生成单条动态详情页。
- 文章放在 `blog/content/posts/`，记录列表每页两篇；中文文章地址仍为 `/posts/文件名/`，日文为 `/jp/posts/文件名/`。修改标题不会改变地址。
- 年龄、生日、喜欢等资料放在 `blog/content/sidebar/basic-info.md` 对应语言的正文中，每项使用 `- 图标 名称：内容` 的 Markdown 列表格式；新增资料直接追加一行。`sidebar/bio.md` 是简介，`sidebar/_index.md` 是头像与链接。
- 栏目名称统一读取对应目录的 `_index.md`，首页、列表和文章返回链接会一起更新。按钮与导航文字放在 `blog/data/interface.yaml`；网站标题与语言名称放在 `blog/config/_default/languages.yaml`。分页条数继续由 `blog/hugo.yaml` 控制。

### 双语 Markdown 格式

每篇文章只编辑、提交一个文件：公共信息放在 front matter 顶层，翻译信息放在 `translations.zh` 和 `translations.jp`，正文上半部分中文、下半部分日文：

```markdown
---
date: "2026-10-19T12:00:00+08:00"
author: "甜甜"
draft: false
cover: "/icon.png?v=2065db7cd551"
translations:
  zh:
    title: "今天的小事"
    cover_alt: "甜甜的猫咪头像"
  jp:
    title: "今日のできごと"
    cover_alt: "甜甜のねこアイコン"
---
<!-- lang:zh -->
这里是中文摘要。
<!--more-->
这里是中文正文。

<!-- lang:jp -->
ここは日本語の紹介です。
<!--more-->
ここは日本語の本文です。
```

- 新增内容时，在相应目录新建 MD，参考上面的格式或复制一份现有双语文件，再修改文件名、日期、标题和正文。本项目使用双语源文件，新增内容直接参考现有文件，不使用原主题的单语内容模板。
- 公共信息只维护一次；语言块里的同名字段可以覆盖公共值，例如分别指定 `description`、`cover_alt` 或 `draft`。
- 语言标记必须单独占一行，严格使用 `<!-- lang:zh -->`、`<!-- lang:jp -->`，每种语言最多出现一次。围栏代码块中的相同文字作为示例保留，不会触发拆分。
- `<!--more-->` 分别写在各自正文中；目录、摘要和 RSS 从当前语言内容生成。
- 尚未完成日文翻译时，同时省略 `translations.jp` 和整个日文正文块，只发布中文；当前语言按钮保持原有行为，缺少对应翻译时前往该语言首页。
- `_index.md` 是栏目配置，正文可以留空；`headless: true` 的侧栏资料可以没有标题。普通文章和动态必须有标题与非空正文。无效格式会在构建时报告源文件及原因。
- `blog/content/` 通过 Hugo mount 作为双语源数据读取，`blog/adapters/` 作为构建入口；源 MD 不会直接发布，也不需要手工维护 `zh/`、`jp/` 两个目录。

双语构建回归检查（只使用 Python 标准库和 Hugo，不增加测试依赖）：

```sh
python3 -m unittest discover -s tests -v
```

如果 Hugo 不在 PATH，可用 `HUGO_BIN=/绝对路径/hugo python3 -m unittest discover -s tests -v`。
