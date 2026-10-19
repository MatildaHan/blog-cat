# blog-cat

我的博客内容统一放在 [`blog/`](blog/)：中文文章在 [`blog/content/zh/`](blog/content/zh/)，日文文章在 [`blog/content/jp/`](blog/content/jp/)，图片在 [`blog/static/`](blog/static/)，站点配置在 [`blog/hugo.yaml`](blog/hugo.yaml)。

在仓库根目录预览：

```sh
hugo server --source blog --themesDir ../.. --theme "$(basename "$PWD")" --bind 127.0.0.1
```

Cloudflare Pages 的根目录留空，构建输出目录填写 `blog/public`，构建命令为：

```sh
hugo --source blog --themesDir ../.. --theme "$(basename "$PWD")" --baseURL "https://blog-cat-5da.pages.dev/" --gc --minify --buildFuture
```

本地与部署环境建议使用 Hugo Extended 0.156.0 或更高版本。以下保留上游 neopost 的原始使用说明及素材来源，其中 `example/` 指上游目录，本仓库使用 `blog/`。

## 当前博客的内容维护

- 首页的「喵喵动态」和「喵喵记录」各展示最新两条，右上角的「查看更多」进入对应列表。
- 短动态放在 `blog/content/zh/moments/`（日文为 `blog/content/jp/moments/`），直接展示 Markdown 全文；`topics` 是展示用标签。动态列表每页两条，不生成单条动态详情页。现有两条动态标注为示例，可直接替换。
- 文章继续放在 `blog/content/zh/posts/` 和 `blog/content/jp/posts/`，记录列表每页两篇，点击标题进入原来的文章地址。
- 年龄、生日、喜欢等资料统一放在各语言的 `sidebar/basic-info.md` 正文中，每项使用 `- 图标 名称：内容` 的 Markdown 列表格式；新增资料直接追加一行，显示顺序与文件中的顺序一致。旧 `welcome-header/` 内容保留为主题参考，首页不再显示欢迎板块。
- 列表标题和导航文字放在 `i18n/zh.yaml`、`i18n/jp.yaml`；分页条数由 `blog/hugo.yaml` 中的 `posts-per-page` 和 `moments-per-page` 控制。

---

# neopost

本仓库的协作、验证及自动提交推送规则见 [项目规范（AGENTS.md）](AGENTS.md)。

*neopost* is a minimalist, customizable theme for personal blogs, inspired by the aesthetics of neocities. it allows for multilingual, flexible content management and easy customization of styles through simple configuration.
![neopost example site, with the "light-blue" variant theme.](https://raw.githubusercontent.com/salatine/neopost/main/images/screenshot.png)
this example site is available at [neopost.neocities.org](https://neopost.neocities.org).

## installation
```bash
hugo new site my-site
cd my-site
git clone "https://github.com/salatine/neopost.git" themes/neopost
```


## configuration
edit `hugo.yaml` to configure the theme:
```yaml
baseURL: "https://example.com"
theme: "neopost"
params:
    theme: "light-purple"
```
set the desired color by changing the `theme` parameter inside `params`, currently there are `light-blue`, `dark-blue`, `light-green`, `light-yellow`, `light-pink`, `light-purple` as options.
you can also add your own custom themes at `/data/custom_themes.yaml` and add its name in the `theme` parameter. if a name of a theme by neopost is conflicted with a custom theme, the themes by neopost are prioritized. all of this is showcased in the example site!

## example site
it's *HIGHLY!* recommended to test the example provided with the theme, just to learn how to mess with it. you can do that by running (considering you already did the installation steps):
```bash
cp -r themes/neopost/example/. .
hugo serve
```
note: images provided in this example site are mostly taken from the [library of congress](https://www.loc.gov/free-to-use/cats/).

## creating content

### posts
```
hugo new content/posts/new-post.md
```
this is most of your stuff, a post will appear at the main page and each one will have a page for itself. you can also attribute tags to your posts, which then can be filtered to easily find specific posts.
you can edit it at `content/posts/new-post.md`.


### sidebar
```
hugo new --kind sidebar sidebar
```
the sidebar from the main page, add a bio and little information about you!
you can edit it at the directory `content/sidebar/`, there are multiple markdown files to edit


### welcome header
```
hugo new --kind welcome-header welcome-header
```
this is above all the posts in the main page, you can give yourself a better introduction here, and say whatever you want.
you can edit it at `content/welcome-header/_index.md`.


### license
*neopost* is licensed under the [gpl-3.0 license](https://raw.githubusercontent.com/salatine/neopost/main/LICENSE).
