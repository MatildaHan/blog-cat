# 甜甜：半身互动角色设计稿

三张设计稿基于当前甜甜头像生成，保持银白毛色、粗线条、白底及正方形构图。图像由内置 image_gen 工具生成，保存为 768 × 768 PNG；本目录用于讨论设计，不会由 Hugo 发布，也尚未接入网页互动。

| 文件 | 状态 |
| --- | --- |
| [idle.png](idle.png) | 待机：睁眼，双爪自然放置 |
| [petting.png](petting.png) | 摸头：闭眼微笑，耳朵放松 |
| [resting.png](resting.png) | 休息：闭眼打盹，头部稍低 |

这三张是独立概念图，尚未制作逐帧动画或可动分层，后续实现时仍需检查角色位置对齐与动作衔接。

## 输入与生成方式

- 待机图使用 [当前头像](../../blog/static/icon.png) 的同版高清生成稿作为角色和画风参考。
- 摸头、休息图使用待机图作为统一参考，分别调用内置 image_gen 生成。
- 保留原头像及现有网页，不自动替换为设计稿。

## 最终提示词

### 待机

```text
Use case: identity-preserve. Asset type: half-body interactive cat mascot concept, state 1 IDLE. Input image is the strict identity and drawing-style reference for the user's cat 甜甜. Create ONE individual square illustration on a clean opaque pure white background, not a contact sheet and with no text. Keep the recognizable exact same cat: very round white face, pale silver-gray patches on the crown, outer cheeks and shoulders, soft pink inner ears and nose, blue-gray eyes with dark pupils and small highlights, chunky dark chocolate-brown uneven hand-drawn outline segments, thick simple whiskers, minimal flat shapes. Preserve the simple charming doodle quality, not realism, watercolor, 3D or detailed fur. Half-body framing: whole head, full ears and whiskers, fluffy upper chest, and the tops of two small rounded white forepaws visible near the lower edge; no hind legs or full body. Cat looks forward attentively with both eyes gently open and a neutral sweet tiny cat mouth; ears naturally upright. Keep the character upright and centered, with generous white margin around every ear and whisker so nothing is cropped. Make the overall composition suitable as the MASTER BASE for subsequent matching petting and sleepy states: square 1:1 canvas, centered head position and consistent character scale. No hats, clothing, collars, props, human hands, speech bubbles, letters, hearts, effects, extra animals or background scenery.
```

### 摸头

```text
Use case: identity-preserve. Edit this exact half-body cat illustration into one matching state in the same character set. The input image is the MASTER identity, style and framing reference. Preserve the same recognizable cat 甜甜, very round white face, pale silver-gray markings in the same places, pink nose and ear interiors, dark chocolate-brown chunky broken hand-drawn outlines and whiskers, minimal flat shapes, fluffy upper chest, and two rounded forepaws near the bottom. Keep the square 1:1 canvas, opaque pure white background, character scale and centered placement; keep complete ears and whiskers inside the frame. No photorealism, watercolor, 3D or detailed fur. No text, letters, labels, speech bubbles, hearts, accessories, props, extra animals or human hands. Make only the state change described below, rather than inventing a different character. STATE 2: HAPPY WHEN PETTED. The cat enjoys being gently petted on the head: replace open eyes with unmistakably cheerful closed upward-arching crescent eyelids, a small soft contented smile at the mouth, slightly lifted cheeks and subtly relaxed ears angled a little outward. Lift the chin just slightly as if leaning into a pet, while keeping the same overall half-body pose and forepaw placement. The expression should be sweet and quietly delighted, not laughing, startled, angry or crying. Do not draw a hand; this is the cat's reaction pose for an interactive website.
```

### 休息

```text
Use case: identity-preserve. Edit this exact half-body cat illustration into one matching state in the same character set. The input image is the MASTER identity, style and framing reference. Preserve the same recognizable cat 甜甜, very round white face, pale silver-gray markings in the same places, pink nose and ear interiors, dark chocolate-brown chunky broken hand-drawn outlines and whiskers, minimal flat shapes, fluffy upper chest, and two rounded forepaws near the bottom. Keep the square 1:1 canvas, opaque pure white background, character scale and centered placement; keep complete ears and whiskers inside the frame. No photorealism, watercolor, 3D or detailed fur. No text, letters, labels, speech bubbles, hearts, accessories, props, extra animals or human hands. Make only the state change described below, rather than inventing a different character. STATE 3: SLEEPY REST. Make the cat peacefully dozing: eyes fully closed with soft shallow relaxed eyelid strokes, not the high happy arches of a smiling cat; little neutral relaxed closed mouth. Lower the chin a little toward the fluffy chest, shoulders settled, ears relaxed, head tilted a very small amount to one side. Keep both front paws naturally resting near the same lower-edge positions as the master. Convey calm drowsiness through the eyelids and posture. This should be visibly a sleepy resting expression, distinct from a happy petting reaction. Do not add ZZZ letters, stars, moon, bedding, hats, pillows or scenery.
```
