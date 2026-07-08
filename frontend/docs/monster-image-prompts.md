# モンスター画像生成プロンプト

`public/monsters/` にある既存画像（bonmon, kanjimon, ikarimon）を見て、絵柄を分析した上で作成。

## 共通スタイル（既存画像から読み取った特徴）

- **実写ベース**：イラストではなく、実在しそうな動物・人物・物のリアルな写真がベース
- **侵食された体**：皮膚や毛にひび割れが入り、そこから発光する亀裂（血管のように見える）が走っている
- **ケーブル/配線**：体からコード・チューブのようなものが生えて絡みついている（バイオメカ的な違和感）
- **霧散するエフェクト**：輪郭が煙・粒子になって溶けるように後方へ流れている
- **不穏な空気感**：ホラー・呪いの心霊写真、アナログホラー的な「見てはいけないもの」感
- **背景**：透過 or 暗いビネット。カード用途なので背景は極力シンプルに

共通で毎回文末に付けるプロンプトサフィックス（英語、画像生成ツール用）：

```
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

タイプごとの発光色の目安（既存3体は厳密には統一されていないが、新規15体は下記で統一する）：

| タイプ | 発光色 |
|---|---|
| BLUE（みず） | cyan / light blue |
| RED（ほのお） | orange-red / ember |
| GREEN（くさ） | toxic green |
| WHITE（はく） | pale gold / white |
| BLACK（こく） | deep violet-black |

---

## BLUE（みず）

### shizukumon（しずくもん・バランス型）
```
A soaked stray cat sitting still, fur drenched and dripping, skin cracked open with glowing cyan veins pulsing beneath wet fur, thin water-filled tubes coiling around its legs, droplets frozen mid-air around it, calm but unsettling stare,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### tsunamon（つなもん・すばやい型）
```
A lean dog captured mid-sprint, motion-blurred, soaked fur flinging water droplets, glowing cyan cracks trailing like a wake behind its body, thin hose-like tubes whipping in the air, sense of violent speed,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### korimon（こおりもん・タンク型）
```
A large still bear partially encased in thick ice, frost crystals growing out of cracked skin, pale cyan glow leaking from beneath the ice, frozen breath fogging the air, motionless and imposing,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

---

## RED（ほのお）

### moemon（もえもん・バランス型）
```
A young fox sitting upright, fur smoldering at the edges, skin cracked with glowing ember-orange veins, faint smoke rising steadily from its shoulders, calm predatory stare,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### kajimon（かじもん・すばやい型）
```
A fox captured mid-leap, engulfed in trailing flame streaks, glowing red-orange cracks running down its legs, ember sparks flying off its fur, dynamic sense of blinding speed,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### yakemon（やけもん・タンク型）
```
A large bull with charred, cracked hide glowing deep red-orange from within like dying coals, thick scorched cables fused into its back, slow embers drifting off its body, heavy and immovable presence,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

---

## GREEN（くさ）

### midorimon（みどりもん・バランス型）
```
A rabbit sitting still, thin vines and moss growing out of cracked skin, small leaves sprouting from its back, glowing toxic-green veins pulsing beneath fur, quiet watchful stare,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### tsurumon（つるもん・すばやい型）
```
A lean cat mid-pounce, thorned vines whipping behind it like a tail, glowing green cracks running along its spine, leaves scattering in its wake, aggressive coiled energy,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### mokumon（もくもん・タンク型）
```
A large tortoise with bark-like fused skin, thick roots growing from its shell and legs, dim green glow leaking from deep cracks in the wood-like hide, completely still and ancient-looking,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

---

## WHITE（はく）

### hikarimon（ひかりもん・バランス型）
```
A pale owl perched still, soft pale-gold light leaking from cracks across its feathers, faint light particles drifting around its body, glowing white eyes, serene but eerie presence,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### kirakiramon（きらきらもん・すばやい型）
```
A small white bird captured mid-flight, leaving a glittering trail of pale-gold light particles, prism-like glowing cracks along its wings, motion blur suggesting extreme speed,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### yukimon（ゆきもん・タンク型）
```
A large pale goat standing still, dusted in fine snow-like white particles, deep cracks glowing faint pale-gold across its thick coat, calm and heavy stillness,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

---

## BLACK（こく）

### yamimon（やみもん・バランス型）
```
A black cat sitting still, parts of its body dissolving into dark smoke, deep violet-black glowing cracks across its fur, thin dark tendrils curling off its back, hollow glowing eyes,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### kagemon（かげもん・すばやい型）
```
A shadow-like dog blurred mid-motion, form barely visible against trailing dark wisps, two glowing violet-black eyes cutting through the smoke, unsettling silent speed,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

### jamon（じゃもん・タンク型）
```
A large snake coiled and still, dark scaled skin deeply cracked with glowing violet-black veins, thick dark cables fused into its coils, slow ominous presence,
hyper-realistic photograph, uncanny cursed-image horror aesthetic, glowing cracked veins spreading across skin/fur, organic cables and wires growing from the body, wisps of smoke dissolving into particles at the edges, eerie unsettling mood, isolated subject, clean transparent or dark vignette background, high detail, 4k
```

---

## 使い方メモ

- 生成後は背景を透過処理してから `public/monsters/<id>.png` に保存（既存の bonmon.png 等と同じ扱い）
- Midjourney等で透過が難しい場合は、暗いビネット背景のまま保存してもOK（kanjimon.png / ikarimon.png はその形式）
- `--ar 3:4` あたりの縦長比率が既存画像に近い
