# blog-cat

「甜甜の博客」是基于 [neopost](https://github.com/salatine/neopost) 的 Hugo 博客，支持中文和日语，保留简洁的猫咪与 neocities 风格。

## 内容与配置

- [`blog/content/`](blog/content/)：每项内容一份双语 MD，上半部分中文、下半部分日文；`posts/` 存放文章，`moments/` 存放短动态，`sidebar/` 存放侧栏资料。
- [双语内容维护说明](docs/bilingual-content.md)：文件格式、新增内容、单语发布与构建检查。Hugo 构建时自动生成对应语言页面，无需维护两份 MD。
- [`blog/static/`](blog/static/)：图片等静态资源。
- [`blog/config/_default/languages.yaml`](blog/config/_default/languages.yaml)：一份双语的网站标题与语言配置。
- [`blog/data/interface.yaml`](blog/data/interface.yaml)：一份双语的按钮、分页和目录等界面文字。
- [`blog/hugo.yaml`](blog/hugo.yaml)：域名、主题、开关和分页配置。
- [`blog/data/custom_themes.yaml`](blog/data/custom_themes.yaml)：自定义配色。
- [`layouts/`](layouts/)：页面模板。

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

## 甜甜待机看板

左下角的甜甜会轻微呼吸、偶尔眨眼，点击可主动眨眼；窄屏默认收起，点击猫头可展开。收起选择会在当前浏览器中保留。

在 `blog/hugo.yaml` 中将 `params.tiantian` 设为 `false` 可关闭组件。[素材与动作说明](assets/tiantian/README.md)包含更新方式，交互检查命令为 `node --test tests/tiantian.test.cjs`。

## 来源与许可

原主题由 [salatine](https://github.com/salatine) 开发，采用 [GPL-3.0 许可证](LICENSE)。原主题示例中的猫咪图片主要来自[美国国会图书馆](https://www.loc.gov/free-to-use/cats/)。协作规范见 [AGENTS.md](AGENTS.md)。
