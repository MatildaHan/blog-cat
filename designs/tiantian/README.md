# 甜甜：半身互动角色设计稿

五张设计稿基于当前甜甜头像生成，保持银白毛色、粗线条、白底及正方形构图。图像由内置 image_gen 工具生成，保存为 768 × 768 PNG；本目录保存原始设计稿，不会由 Hugo 直接发布；待机与收起图已转换为初版网页看板资源，见[看板说明](../../assets/tiantian/README.md)。

| 文件 | 状态 |
| --- | --- |
| [idle.png](idle.png) | 待机：睁眼，双爪自然放置 |
| [petting.png](petting.png) | 摸头：闭眼微笑，耳朵放松 |
| [resting.png](resting.png) | 休息：闭眼打盹，头部稍低 |
| [speaking.png](speaking.png) | 说话：睁眼，小幅张嘴喵叫 |
| [collapsed.png](collapsed.png) | 收起：只保留猫头，用作展开入口 |

这五张是独立概念图。初版网页看板使用待机图、专用闭眼图和收起图；摸头、休息、说话仍未接入。后续扩展状态时仍需检查位置对齐与动作衔接。

## 输入与生成方式

- 待机图使用 [当前头像](../../blog/static/icon.png) 的同版高清生成稿作为角色和画风参考。
- 摸头、休息、说话图使用待机图作为统一参考，分别调用内置 image_gen 生成。
- 收起图同时参考待机图与当前头像，简化为适合小尺寸显示的猫头；按钮边框、展开行为和台词气泡由后续网页组件实现。
- 原头像继续用于侧栏；网页看板使用独立优化资源，不覆盖本目录设计稿。

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

### 说话

```text
Use case: identity-preserve. Asset type: half-body interactive cat mascot concept, state 4 SPEAKING. The input image is the master idle-state illustration of the user's cat 甜甜. Make ONE matching state illustration, retaining the square 1:1 canvas, clean opaque pure white background, cat's scale, centered position, round white head, identical pale silver-gray markings, pink ears and nose, blue-gray open eyes, chunky dark chocolate-brown broken hand-drawn outlines, simple flat shapes, fluffy upper chest and two little rounded forepaws resting near the bottom. Change the mouth to a small clearly open, gently rounded friendly meowing/talking mouth with a restrained pale-pink interior. Keep the eyes attentive and friendly and the ears upright. Preserve the mouth's natural feline anatomy: small opening below the nose, no human lips, large grin, teeth, fangs, or long tongue, and not yawning, shouting or hissing. Keep the silhouette and paw positions as close to the idle reference as possible, suitable for later switching between closed-mouth idle and open-mouth speaking frames. All ears and whiskers remain fully inside the frame. Do not add text, speech bubbles, labels, accessories, clothing, human hands, hearts, extra animals or scenery. Preserve the current charming sparse hand-drawn style; no photorealism, 3D, detailed fur or watercolor.
```

### 收起

```text
Use case: identity-preserve. Asset type: compact collapsed-state launcher icon for the same interactive cat mascot, state 5 COLLAPSED. Image 1 is the master half-body cat design and image 2 is the same cat's approved avatar; both are identity and drawing-style references. Create ONE square 1:1 illustration on a clean opaque pure white background. Show ONLY the same cat 甜甜's round head and full ears and whiskers, with no chest, body, paws or tail. This compact head icon will later appear as a small reopen button when the larger half-body mascot is folded away. Make the head centered and compact, with about 10 percent clean white margin so all whiskers and ears fit; avoid stretching the face to fill the corners. Preserve white fur, recognizable subtle pale silver-gray patches on the forehead and cheeks, pink nose and ear interiors, gently open blue-gray eyes, tiny closed feline mouth, chunky dark chocolate-brown irregular broken outlines and short simple whiskers. Match the existing flat hand-drawn doodle style exactly. Reduce unnecessary small detail so the face remains readable when displayed at 48–64 pixels. No rendered UI button frame, border, circular badge, arrows, minus sign, text, labels, speech bubbles, stars, clothing, collars or other props. Do not draw a second character. No realistic fur, 3D, gradients or watercolor.
```
