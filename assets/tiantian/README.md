# 甜甜互动看板

- `idle.png`：基于待机素材去除外部白底，保留白色毛发，保存为 320 × 320 透明 PNG。
- `blink.png`：专用闭眼图去除外部白底后，保存为 320 × 320 透明 PNG。
- `collapsed.png`：收起猫头去除外部白底后，保存为 128 × 128 透明 PNG。
- `petting.png`、`resting.png`、`speaking.png`：对应摸头、休息和说话，分别基于同名设计稿去除外部白底，保存为 320 × 320 透明 PNG。
- 眨眼图仅通过眼部遮罩叠加，身体与双爪始终使用待机图，避免切换时抖动。
- 点击猫咪进入摸头表情，约 1.8 秒后恢复待机；再次点击会重新计时。
- 点击“休息”进入打盹状态，按钮变为“唤醒”；点击猫咪或“唤醒”恢复待机。待机时 45 秒未操作看板也会自动休息。
- 点击“说话”进入张嘴表情，同时显示“喵喵喵”气泡，约 3 秒后恢复待机。气泡由 HTML/CSS 绘制，可在 `blog/data/interface.yaml` 中修改台词。
- 点击右上方的“收起”显示小猫头，再点猫头展开；收起或离开页面会结束临时表情和气泡，暂停自动计时。

看板固定在左下角，展开与收起时均不显示白色卡片、圆形底板或边框，直接展示猫咪的透明轮廓。素材使用内置 image_gen 去除外部背景，原始白底设计稿保留在 `designs/tiantian/`，透明处理的[最终提示词](transparency-prompts.md)单独保存。

自动眨眼间隔为随机 4.2–9.8 秒，一次闭眼 160 毫秒，仅在待机时执行。呼吸周期 4.8 秒，休息时放慢为 6.4 秒，幅度约 1 像素。手机及不超过 1200px 的窄屏首次访问默认收起，可展开；收起选择保存在当前浏览器中，中日页面共用。后台页面暂停，系统选择减少动态效果时停止自动动画及自动休息，仍可手动切换表情。新表情图片加载失败时保留待机图，避免猫咪消失。

运行交互检查：`node --test tests/tiantian.test.cjs`。在 `blog/hugo.yaml` 中将 `params.tiantian` 设为 `false` 可关闭整个组件。

## 最初闭眼图提示词（去底前）

```text
Precise animation-frame edit of the supplied cat illustration. Create a BLINK frame for this exact existing idle character. Change ONLY the two open eyes into softly closed eyelids: two short gently curved dark chocolate-brown lines, at exactly the existing eye positions. Keep the exact same square canvas, cat scale and placement, round face silhouette, head angle, upright ears, individual outline marks, white fur, pale silver-gray patches, pink nose, closed mouth, whiskers, upper chest, paws and white background. Do not change any head, body or paw pose, do not lower or tilt the head, do not smile or add cheek marks. It should be the same cat doing a neutral quick blink, suitable to alternate with the supplied idle image. Eyes should be gently relaxed shallow arcs, not an exaggerated happy expression. No text, effects, props, extra animals or background changes. Output one single square image.
```
