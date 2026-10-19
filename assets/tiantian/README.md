# 甜甜待机看板

- `idle.png`：从 `designs/tiantian/idle.png` 缩小至 320 × 320。
- `blink.png`：以内置 image_gen 编辑待机图，只闭合双眼，再缩小至 320 × 320。
- `collapsed.png`：从 `designs/tiantian/collapsed.png` 缩小至 128 × 128。
- 眨眼图仅通过眼部遮罩叠加，身体与双爪始终使用待机图，避免切换时抖动。
- 本版没有摸头表情、休息状态或说话气泡；点击猫咪会主动眨一次眼。

自动眨眼间隔为随机 4.2–9.8 秒，一次闭眼 160 毫秒；点击时闭眼 260 毫秒。呼吸周期 4.8 秒，幅度约 1 像素。手机及不超过 1200px 的窄屏首次访问默认收起，可展开；收起选择保存在当前浏览器中，中日页面共用。后台页面暂停，系统选择减少动态效果时停止自动动画。

运行交互检查：`node --test tests/tiantian.test.cjs`。在 `blog/hugo.yaml` 中将 `params.tiantian` 设为 `false` 可关闭整个组件。

## 闭眼图最终提示词

```text
Precise animation-frame edit of the supplied cat illustration. Create a BLINK frame for this exact existing idle character. Change ONLY the two open eyes into softly closed eyelids: two short gently curved dark chocolate-brown lines, at exactly the existing eye positions. Keep the exact same square canvas, cat scale and placement, round face silhouette, head angle, upright ears, individual outline marks, white fur, pale silver-gray patches, pink nose, closed mouth, whiskers, upper chest, paws and white background. Do not change any head, body or paw pose, do not lower or tilt the head, do not smile or add cheek marks. It should be the same cat doing a neutral quick blink, suitable to alternate with the supplied idle image. Eyes should be gently relaxed shallow arcs, not an exaggerated happy expression. No text, effects, props, extra animals or background changes. Output one single square image.
```
