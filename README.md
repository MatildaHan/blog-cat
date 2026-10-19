# blog-cat

「甜甜の博客」是基于 [neopost](https://github.com/salatine/neopost) 的 Hugo 博客，支持中文和日语，保留简洁的猫咪与 neocities 风格。

## 内容与配置

- [`blog/content/zh/`](blog/content/zh/)：中文内容；[`blog/content/jp/`](blog/content/jp/)：日语内容。
- 各语言目录中的 `posts/` 存放文章，`moments/` 存放短动态，`sidebar/` 存放侧栏资料。
- [`blog/static/`](blog/static/)：图片等静态资源。
- [`blog/hugo.yaml`](blog/hugo.yaml)：站点、语言和分页配置。
- [`blog/data/custom_themes.yaml`](blog/data/custom_themes.yaml)：自定义配色。
- [`layouts/`](layouts/)：页面模板；[`i18n/`](i18n/)：界面翻译。

## 本地预览

需要 Hugo Extended 0.156.0 或更高版本。在仓库根目录执行：

```sh
hugo server --source blog --themesDir ../.. --theme "$(basename "$PWD")" --bind 127.0.0.1
```

浏览器访问 <http://127.0.0.1:1313/>。

## 部署

通过 Cloudflare Pages 的 GitHub 集成自动部署，根目录留空，输出目录为 `blog/public`。构建环境使用 Hugo Extended 0.156.0 或更高版本，构建命令为：

```sh
hugo --source blog --themesDir ../.. --theme "$(basename "$PWD")" --baseURL "https://blog-cat-5da.pages.dev/" --gc --minify --buildFuture
```

## 来源与许可

原主题由 [salatine](https://github.com/salatine) 开发，采用 [GPL-3.0 许可证](LICENSE)。原主题示例中的猫咪图片主要来自[美国国会图书馆](https://www.loc.gov/free-to-use/cats/)。协作规范见 [AGENTS.md](AGENTS.md)。
