"""Exercise the published-page contract with a real Hugo build (stdlib only)."""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
HUGO = os.environ.get("HUGO_BIN") or shutil.which("hugo")


def markdown(metadata, body):
    # JSON is valid YAML, so fixtures need no third-party YAML library.
    return "---\n" + json.dumps(metadata, ensure_ascii=False) + "\n---\n" + body


class BilingualBuildTests(unittest.TestCase):
    def setUp(self):
        if not HUGO:
            self.fail("Install Hugo Extended >= 0.156.0 or set HUGO_BIN")
        self.temp = tempfile.TemporaryDirectory(prefix="blog-cat-bilingual-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.site = self.root / "site"
        (self.site / "content").mkdir(parents=True)
        shutil.copytree(ROOT / "blog/adapters", self.site / "adapters")
        shutil.copytree(ROOT / "blog/config", self.site / "config")
        shutil.copytree(ROOT / "blog/data", self.site / "data")
        self.config = (ROOT / "blog/hugo.yaml").read_text()
        (self.site / "hugo.yaml").write_text(self.config)

    def write(self, relative, metadata, bodies, newline="\n"):
        text = markdown(metadata, "\n".join(
            f"<!-- lang:{lang} -->\n{body}" for lang, body in bodies.items()
        ))
        path = self.site / "content" / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(text.replace("\n", newline).encode())
        return path

    def build(self, site=None, success=True):
        site = site or self.site
        output = site / "public"
        result = subprocess.run([
            HUGO, "--source", str(site), "--themesDir", str(ROOT.parent),
            "--theme", ROOT.name, "--destination", str(output),
            "--cacheDir", str(self.root / "cache"), "--minify", "--gc",
            "--buildFuture", "--printPathWarnings",
        ], text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        if success:
            self.assertEqual(result.returncode, 0, result.stdout)
            self.assertNotIn("Duplicate target paths", result.stdout)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout)
        return output, result.stdout

    def test_same_output_as_separate_language_files(self):
        reference = self.root / "reference"
        reference.mkdir()
        config = self.config.split("# Read each bilingual")[0]
        shutil.copytree(self.site / "config", reference / "config")
        shutil.copytree(self.site / "data", reference / "data")
        languages = reference / "config/_default/languages.yaml"
        settings = languages.read_text().replace("zh:\n", "zh:\n  contentDir: content/zh\n", 1)
        settings = settings.replace("jp:\n", "jp:\n  contentDir: content/jp\n", 1)
        languages.write_text(settings)
        (reference / "hugo.yaml").write_text(config)
        fixtures = [
            ("posts/_index.md", {}, {"zh": {"title": "记录"}, "jp": {"title": "記録"}}, {"zh": "", "jp": ""}),
            ("moments/_index.md", {
                "outputs": ["HTML"], "build": {"render": "always"},
                "cascade": [{"build": {"list": "local", "render": "never", "publishResources": False}}],
            }, {"zh": {"title": "动态"}, "jp": {"title": "つぶやき"}}, {"zh": "", "jp": ""}),
            ("sidebar/_index.md", {"headless": True, "icon-path": "/icon.png"},
             {"zh": {"links": [{"name": "链接", "link": "https://example.org/"}]},
              "jp": {"links": [{"name": "リンク", "link": "https://example.org/"}]}}, {"zh": "", "jp": ""}),
            ("sidebar/bio.md", {"headless": True}, {"zh": {}, "jp": {}},
             {"zh": "中文简介。", "jp": "日本語の紹介。"}),
        ]
        for number in range(1, 4):
            common = {"date": f"2025-01-0{number}T12:00:00+08:00", "author": "甜甜", "draft": False,
                      "table-of-contents": True, "toc-auto-numbering": True}
            translations = {"zh": {"title": f"中文文章{number}", "description": "中文描述"},
                            "jp": {"title": f"日本語の記事{number}", "description": "日本語の説明"}}
            bodies = {"zh": f"## 中文摘要{number}\n介绍。\n<!--more-->\n### 正文\n**中文内容**。",
                      "jp": f"## 日本語の紹介{number}\n紹介。\n<!--more-->\n### 本文\n**日本語の内容**。"}
            fixtures.append((f"posts/post-{number}.md", common, translations, bodies))
            fixtures.append((f"moments/moment-{number}.md", {"date": common["date"]},
                             {"zh": {"title": "动态"}, "jp": {"title": "つぶやき"}},
                             {"zh": "短动态。", "jp": "短いつぶやき。"}))
        for relative, common, translations, bodies in fixtures:
            self.write(relative, dict(common, translations=translations), bodies)
            for lang in translations:
                path = reference / "content" / lang / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(markdown(dict(common, **translations[lang]), bodies[lang]))
        actual, _ = self.build()
        expected, _ = self.build(reference)
        actual_files = {str(p.relative_to(actual)): p.read_bytes() for p in actual.rglob("*") if p.is_file()}
        expected_files = {str(p.relative_to(expected)): p.read_bytes() for p in expected.rglob("*") if p.is_file()}
        self.assertEqual(actual_files.keys(), expected_files.keys())
        for name in expected_files:
            with self.subTest(output=name):
                self.assertEqual(actual_files[name], expected_files[name], name)
        self.assertTrue((actual / "posts/page/2/index.html").exists())
        self.assertTrue((actual / "jp/moments/page/2/index.html").exists())
        self.assertFalse((actual / "moments/moment-1/index.html").exists())

    def test_editing_bilingual_settings_updates_both_languages(self):
        languages = self.site / "config/_default/languages.yaml"
        languages.write_text(languages.read_text().replace("甜甜の博客", "中文新站名").replace("甜甜のブログ", "日本語の新サイト名"))
        interface = self.site / "data/interface.yaml"
        interface.write_text(interface.read_text().replace("查看更多", "查看新内容").replace("もっと見る", "新しい内容を見る"))
        self.write("posts/_index.md", {"translations": {"zh": {"title": "中文新栏目"}, "jp": {"title": "日本語の新しい記録"}}}, {"zh": "", "jp": ""})
        self.write("posts/sample.md", {"translations": {"zh": {"title": "文章"}, "jp": {"title": "記事"}}}, {"zh": "中文。", "jp": "日本語。"})
        output, _ = self.build()
        for prefix, title, heading in [("", "中文新站名", "中文新栏目"), ("jp/", "日本語の新サイト名", "日本語の新しい記録")]:
            with self.subTest(language=prefix or "zh"):
                home = (output / prefix / "index.html").read_text()
                self.assertIn(title, home)
                self.assertIn(heading, home)
                self.assertIn("查看新内容" if not prefix else "新しい内容を見る", home)
                self.assertIn(heading, (output / prefix / "posts/index.html").read_text())
                self.assertIn(title, (output / prefix / "posts/sample/index.html").read_text())
                self.assertIn(title, (output / prefix / "index.xml").read_text())

    def test_markdown_article_cover_and_removed_taxonomies(self):
        self.write("posts/_index.md", {"translations": {"zh": {"title": "文章"}, "jp": {"title": "記事"}}}, {"zh": "", "jp": ""})
        self.write("posts/example.md", {"cover": "/icon.png", "table-of-contents": True,
                   "translations": {"zh": {"title": "示例文章", "cover_alt": "头像", "tags": ["旧标签"]},
                                    "jp": {"title": "サンプル記事", "cover_alt": "アイコン", "tags": ["古いタグ"]}}},
                   {"zh": "中文摘要。\n<!--more-->\n## 正文\n![头像](/icon.png)\n### 结尾\n中文结束。",
                    "jp": "日本語の紹介。\n<!--more-->\n## 本文\n![アイコン](/icon.png)\n### おわり\n日本語のおわり。"})
        output, _ = self.build()
        for prefix, intro, rest, alt in [("", "中文摘要。", "中文结束。", "头像"), ("jp/", "日本語の紹介。", "日本語のおわり。", "アイコン")]:
            with self.subTest(language=prefix or "zh"):
                article = (output / prefix / "posts/example/index.html").read_text()
                home = (output / prefix / "index.html").read_text()
                self.assertEqual(article.count(intro), 2)  # meta description and body
                self.assertIn(rest, article)
                self.assertIn("/icon.png", article)
                self.assertIn(alt, home)
                self.assertIn("class=article-toc", article)
                self.assertNotIn("/tags/", article)
                self.assertFalse((output / prefix / "tags").exists())
                self.assertFalse((output / prefix / "categories").exists())

    def test_single_language_and_localized_overrides(self):
        self.write("posts/only.md", {"title": "公共标题", "description": "公共描述", "draft": True,
                   "translations": {"zh": {"title": "覆盖后的标题", "description": "覆盖后的描述", "draft": False}}},
                   {"zh": "只有中文。"})
        output, _ = self.build()
        html = (output / "posts/only/index.html").read_text()
        self.assertIn("覆盖后的标题", html)
        self.assertIn("覆盖后的描述", html)
        self.assertNotIn("公共描述", html)
        self.assertFalse((output / "jp/posts/only/index.html").exists())
        self.assertIn('href=/jp/', html)

    def test_draft_translation_is_not_published(self):
        self.write("posts/draft.md", {"translations": {"zh": {"title": "已发布"}, "jp": {"title": "下書き", "draft": True}}},
                   {"zh": "可阅读。", "jp": "まだ下書き。"})
        output, _ = self.build()
        self.assertTrue((output / "posts/draft/index.html").exists())
        self.assertFalse((output / "jp/posts/draft/index.html").exists())

    def test_fenced_examples_and_windows_newlines(self):
        for fence in ("```", "~~~~"):
            with self.subTest(fence=fence):
                self.write("posts/code.md", {"translations": {"zh": {"title": "代码"}, "jp": {"title": "コード"}}},
                           {"zh": f"中文正文。\n{fence}text\n<!-- lang:jp -->\n代码里的标记\n{fence}", "jp": "日本語本文。"}, newline="\r\n")
                output, _ = self.build()
                zh = (output / "posts/code/index.html").read_text()
                jp = (output / "jp/posts/code/index.html").read_text()
                self.assertIn("代码里的标记", zh)
                self.assertNotIn("日本語本文", zh)
                self.assertIn("日本語本文", jp)
                self.assertNotIn("代码里的标记", jp)

    def test_invalid_sources_fail_with_file_and_reason(self):
        cases = [
            ("invalid YAML", "---\ntranslations: [\n---\n<!-- lang:zh -->\n正文", "invalid YAML front matter"),
            ("invalid map", markdown(["not a map"], "正文"), "must be a map"),
            ("invalid translations", markdown({"translations": "zh"}, "正文"), "translations must contain"),
            ("invalid language metadata", markdown({"translations": {"zh": "中文"}}, "<!-- lang:zh -->\n正文"), "translations.zh must be a map"),
            ("invalid date", markdown({"date": "bad-date", "translations": {"zh": {"title": "标题"}}}, "<!-- lang:zh -->\n正文"), "invalid date"),
            ("no front matter", "中文正文", "YAML front matter"),
            ("no translations", markdown({"title": "标题"}, "<!-- lang:zh -->\n中文"), "translations must contain"),
            ("missing block", markdown({"translations": {"zh": {"title": "标题"}, "jp": {"title": "題"}}}, "<!-- lang:zh -->\n中文"), "missing its"),
            ("missing metadata", markdown({"translations": {"zh": {"title": "标题"}}}, "<!-- lang:zh -->\n中文\n<!-- lang:jp -->\n日本語"), "missing translations.jp"),
            ("duplicate", markdown({"translations": {"zh": {"title": "标题"}}}, "<!-- lang:zh -->\n中文\n<!-- lang:zh -->\n重复"), "duplicate language marker"),
            ("unsupported", markdown({"translations": {"zh": {"title": "标题"}}}, "<!-- lang:en -->\nEnglish"), "unsupported language marker"),
            ("empty body", markdown({"translations": {"zh": {"title": "标题"}}}, "<!-- lang:zh -->\n"), "is empty"),
            ("missing title", markdown({"translations": {"zh": {}}}, "<!-- lang:zh -->\n中文"), "title is required"),
            ("unmarked text", markdown({"translations": {"zh": {"title": "标题"}}}, "未标记内容\n<!-- lang:zh -->\n中文"), "content must start"),
        ]
        path = self.site / "content" / "invalid.md"
        for name, text, reason in cases:
            with self.subTest(case=name):
                path.write_text(text)
                _, log = self.build(success=False)
                self.assertIn("invalid.md", log)
                self.assertIn(reason, log)


if __name__ == "__main__":
    unittest.main()
