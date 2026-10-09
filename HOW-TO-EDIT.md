# 网站维护说明

网站的文字内容都放在 `_data/` 文件夹里，英文（`en`）和法文（`fr`）写在一起。改内容只需要改这些 `.yml` 文件，不用碰页面模板。上传到 GitHub 之后，可以直接在 GitHub 网页上点开文件，用右上角的铅笔图标编辑。

| 想改什么 | 改哪个文件 |
|---|---|
| 姓名、一句话介绍、简介、求职状态、邮箱、LinkedIn、CV 链接、研究兴趣标签 | `_data/profile.yml` |
| 首页 News | `_data/news.yml`（最新的放最上面） |
| RESEARCH 栏的研究（方块 + 详情页） | `_data/research.yml` |
| PROJECTS 栏的课程项目（方块 + 详情页） | `_data/projects.yml` |
| 详情页里的 PPT | `_data/decks.yml` + `assets/slides/` |
| CV 页（经历、学历、技能、语言） | `_data/cv.yml` |
| 导航、按钮、栏目标题等界面文字 | `_data/ui.yml` |
| 颜色、字体、版式 | `assets/site/site.css`（颜色在文件开头 `:root` 里） |

## 网站结构

- 首页 `/`（法文 `/fr/`）
- Research & Projects 页 `/research/`：上面是 RESEARCH 栏，下面是 PROJECTS 栏，每个方块点进去是详情页。
- 详情页 `/research/<id>/`：标题、简介、PPT（如果有）、关键参数、PDF。研究和课程项目的详情页都在这个网址下。
- CV 页 `/cv/`

## 常见操作

**加一条 News**：在 `_data/news.yml` 最上面复制一段，改 `date`、`when` 和 `text` 的 en / fr。

**给已有的研究或项目加 PPT**：
1. 在 Canva 里「分享 → 下载 → PDF」导出。不要用 PowerPoint 导出，Canva 的字体在 PowerPoint 里会显示错误。
2. 在网站文件夹里运行（`deck-id` 自己取一个英文短名，比如 `ikea`）：
   ```bash
   python3 _tools/make_slides.py ~/Downloads/你的文件.pdf deck-id 起始页 结束页
   ```
3. 在 `_data/decks.yml` 里加一段：`id` 填同一个 `deck-id`，`count` 填脚本打印出来的页数，`pdf` 填 `/assets/slides/deck-id/deck-id.pdf`。
4. 在 `research.yml` 或 `projects.yml` 里对应的项目下面加一行 `deck: deck-id`。方块上会自动出现「Slides · 页数」，详情页里会出现播放器；课程项目的方块会用 PPT 第一页做封面。
5. 上传 `assets/slides/deck-id/` 整个文件夹和改过的两个 `.yml` 文件。

**加一个新的研究或项目**：
1. 在 `research.yml` 或 `projects.yml` 里复制一段已有的，改成新内容。`id` 用英文小写加连字符，比如 `haptic-alert`，不能和已有的重复。
2. 新建两个小文件（在 GitHub 网页上可以用「Add file → Create new file」，文件名里打 `research/` 会自动建文件夹）：
   - `research/haptic-alert.html`，内容：
     ```
     ---
     layout: sc-item
     lang: en
     key: research
     item: haptic-alert
     permalink: /research/haptic-alert/
     ---
     ```
   - `fr/research/haptic-alert.html`，内容同上，但 `lang: fr`，`permalink: /fr/research/haptic-alert/`。
3. 方块的顺序就是 `.yml` 里的顺序。详情页底部的「上一个 / 下一个」也按这个顺序。

**换 CV**：把新 PDF 放进 `assets/PDFs/`，然后改 `_data/profile.yml` 里的 `cv_pdf`。文件名最好不要带空格。

**换照片**：替换 `assets/img/portrait.jpg`，比例 4:5，宽度 560 px 左右即可。

## 改 `.yml` 的规则

- 缩进只用空格，不要用 Tab，并且和上下行对齐。
- 文字里有「冒号加空格」（法语里很常见，比如 `décisions : une étude`）时，整段要用英文双引号包起来。
- 在 `{ … }` 或 `[ … ]` 里面，含逗号的文字也要加双引号。
- 引号必须是直引号 `"`，不能是弯引号 `“ ”`。
- `en:` 和 `fr:` 两个都要保留。
- 上传后如果 GitHub 的「Actions」里出现红色 ✗，点进去能看到是哪个文件的哪一行出错。

## 文件夹说明

- `_layouts/sc-*.html`、`_includes/sc-*.html`：新网站的页面模板。
- `index.html`、`research.html`、`cv.html`：英文页面；`fr/` 里是对应的法文页面；`research/` 和 `fr/research/` 里是每个详情页的小文件。它们都只有几行设置，内容来自 `_data/`。
- `legacy/`：旧网址 `/aboutme/` 自动跳转到 CV 页。旧的 `/Projects/` 由 404 页面（`not-found.html`）自动跳转到 PROJECTS 栏，旧链接不会失效。
- `_tools/make_slides.py`：把 PDF 转成网页幻灯片的脚本。
- `_site/`：本地预览时生成的网站，已被 `.gitignore` 忽略，不要上传。
- 旧主题（beautiful-jekyll）留下的文件已经不再发布，可以删除：`_layouts/` 和 `_includes/` 里不带 `sc-` 前缀的文件、`assets/css/`、`assets/js/`、`assets/data/`、`_data/ui-text.yml`、`aboutme.md`、`Projects.md`、`404.html`、`tags.html`、`feed.xml`、`staticman.yml`、`CHANGELOG.md`、`screenshot.png`，以及 `assets/img/` 里的 `404-southpark.jpg`、`avatar-icon.png`、`bgimage.png`、`crepe.jpg`、`path.jpg`、`thumb.png`。删除后请同时把它们从 `_config.yml` 的 `exclude` 列表里去掉。`.github/`、`Gemfile`、`Appraisals`、`beautiful-jekyll-theme.gemspec` 是旧主题的自动检查用的，要删就四个一起删。
