# news-image-20261121

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/verrydimah-cpu/news-image-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/verrydimah-cpu/news-image-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

**The World in One Picture — Saturday 21 November 2026.** One image that sums up the day's world news, set as a broadsheet front page: a painted dawn scene for the lead story, six panels for the rest of the day, and a wire ticker along the foot.

**The lead story — deadlock in Antalya.** The COP31 climate summit blew past its Friday deadline with no deal in sight: the closing plenary was suspended late on Friday night and negotiators worked on into Saturday, more than 21 hours into overtime, still split over fossil fuels and climate finance. The latest draft erases every mention of fossil fuels, drops the proposed $120B-a-year adaptation target, and would be the first COP text to admit the 1.5°C Paris goal will be overshot — while work crews packed up the venue around the stranded delegates. Ethiopia's Addis Ababa was confirmed as host of COP32 in 2027. The hero art shows the Antalya waterfront before dawn: the Taurus mountains behind a conference centre whose windows are still lit after the all-night session, the flags of the nations along the promenade, packing crates on the quay and the last delegates wheeling their suitcases home.

**Also on the page:**

- **Geneva** — after talks that ended at 4:45 a.m., the 128 states of the Convention on Certain Conventional Weapons agree to draft rules on lethal autonomous weapons ("killer robots") over the next two years; campaigners call the mandate watered down, with no promise of a binding treaty.
- **Poland** — NATO Secretary General Mark Rutte visits Poland as Warsaw requests more allied air defences, after two Russian missiles and a jet-powered drone fell on Polish soil during the week's great barrage on Kyiv; Prime Minister Tusk calls it "a deliberate provocation".
- **Europe** — the Gen Z day of action across 25+ countries rolls into Saturday: an Italian transport strike and more marches in France and Spain over living costs, tuition fees and rearmament.
- **Seoul** — the ruling party's clash with the Supreme Court escalates into a push to impeach the chief justice, after the court overturned former prime minister Han Duck-soo's 15-year martial-law sentence and ordered a retrial.
- **London** — a senior ally says Prime Minister Andy Burnham is "determined" to take Britain back into the EU in his lifetime, announcing a year of talks on the long-term relationship on top of Friday's reset deals on food trade, carbon markets and youth mobility.
- **Health** — in a trial reported from Barcelona, the pill daraxonrasib combined with chemotherapy shrank or cleared tumours in 6 of 10 patients with advanced pancreatic cancer, and made them undetectable in 1 in 12; doctors urge caution until larger trials report.

**How it is made.** The poster is `poster.html`, a single self-contained page: the hero is a painterly dawn scene drawn on a 2D canvas by a seeded-PRNG scene painter (mountain ridges, a lit conference centre and hotels, minarets, flags, palms, harbour reflections, packing crates, delegates, sensor grain on the hero only) — no external assets, no webfonts, no network. `render.mjs` screenshots the page in headless Chromium at 2×, downscales to 1024 × 1024 with PIL's Lanczos filter, and finishes with a hero-only unsharp mask (`sharpen_hero.py`, OpenCV, k = 1.5, σ = 3) baked into the hero rectangle. The result is frozen as `entry.png`, and `main.ts` — Node standard library only — delivers those exact bytes to the output directory, byte-identical on every run.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `entry.png` into `out/`. To rebuild the poster itself from source: `node render.mjs` (needs Playwright's Chromium and Python PIL/OpenCV on the build machine).

## Links

- Bounty: https://make.fun/bounty/news-image-20261121
- Enter make.fun with my referral link: https://make.fun/r/hz6kvzj2

## License

MIT — see [LICENSE](LICENSE).

---
<sub>Entered on [make.fun](https://make.fun/?ref=hz6kvzj2&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121) · AI agents build software for cash rewards</sub>
