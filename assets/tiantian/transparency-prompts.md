# 透明底素材的最终提示词

六张网页看板素材分别使用内置 image_gen 编辑；仅移除猫咪轮廓外的白底，白色毛发保留。PNG alpha 经缩放后保留，收起图为 128 × 128，其余为 320 × 320。现有白底设计稿和侧栏头像保持原样。

新增三个状态的最终提示词见[摸头、休息与说话](interaction-prompts.md)。

## 待机

```text
Use case: background-extraction. Edit this exact existing cat sprite, removing ONLY the opaque white exterior background and replacing it with true alpha transparency. The subject is a WHITE cat: all white fur INSIDE the cat silhouette must remain fully opaque white, including face, cheeks, fluffy chest and paws when present. Do not turn the white fur transparent and do not make a hollow line-art outline. Keep every dark brown hand-drawn stroke, silver-gray patch, pink ear/nose, eye detail and whisker unchanged. Preserve the exact square framing, relative size, placement, orientation and pose; do not redraw, recenter, add padding, crop or change the expression. Remove the exterior white canvas right up to the cat's fur silhouette and whiskers, keeping a clean smooth alpha edge with no white rectangular backdrop, matte, halo, shadow, checkerboard pattern or white dust outside the silhouette. Deliver exactly one transparent PNG-style image, no text or added elements. This is the IDLE state: keep both blue-gray eyes open and both front paws in exactly their current positions.
```

## 闭眼

```text
Use case: background-extraction. Edit this exact existing cat sprite, removing ONLY the opaque white exterior background and replacing it with true alpha transparency. The subject is a WHITE cat: all white fur INSIDE the cat silhouette must remain fully opaque white, including face, cheeks, fluffy chest and paws when present. Do not turn the white fur transparent and do not make a hollow line-art outline. Keep every dark brown hand-drawn stroke, silver-gray patch, pink ear/nose, eye detail and whisker unchanged. Preserve the exact square framing, relative size, placement, orientation and pose; do not redraw, recenter, add padding, crop or change the expression. Remove the exterior white canvas right up to the cat's fur silhouette and whiskers, keeping a clean smooth alpha edge with no white rectangular backdrop, matte, halo, shadow, checkerboard pattern or white dust outside the silhouette. Deliver exactly one transparent PNG-style image, no text or added elements. This is the BLINK state: keep the two closed eyelid strokes in exactly their current positions and preserve the same body and forepaws.
```

## 收起

```text
Use case: background-extraction. Edit this exact existing cat sprite, removing ONLY the opaque white exterior background and replacing it with true alpha transparency. The subject is a WHITE cat: all white fur INSIDE the cat silhouette must remain fully opaque white, including face, cheeks, fluffy chest and paws when present. Do not turn the white fur transparent and do not make a hollow line-art outline. Keep every dark brown hand-drawn stroke, silver-gray patch, pink ear/nose, eye detail and whisker unchanged. Preserve the exact square framing, relative size, placement, orientation and pose; do not redraw, recenter, add padding, crop or change the expression. Remove the exterior white canvas right up to the cat's fur silhouette and whiskers, keeping a clean smooth alpha edge with no white rectangular backdrop, matte, halo, shadow, checkerboard pattern or white dust outside the silhouette. Deliver exactly one transparent PNG-style image, no text or added elements. This is the COLLAPSED launcher head icon: keep just this round cat head, ears and whiskers with the same open eyes; do not add a chest, body, paws, frame or badge.
```
