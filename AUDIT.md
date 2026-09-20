# Gateway Ltd — Project Audit

**Repo:** `davetechk/Gateway_LTD` (GitHub) · **Branch:** `main` · **Audit date:** 2026-09-19
**Method:** read-only static review of every tracked file (53 files, 41 commits). No installs, builds, deploys, or commits. Nothing was run in a browser, so "console errors" and "responsive gaps" below are inferred from code, not observed.
**Secrets:** none are printed here. Only key *names* and *shapes* are mentioned.

---

## 0. Top findings (read this first)

| # | Severity | Finding | Where |
|---|---|---|---|
| 1 | High | **No deployment config in the repo at all** (no `vercel.json`, `package.json`, `robots.txt`, `_redirects`, `.env*`). How each site is deployed cannot be confirmed from code. | repo root |
| 2 | High | **Zero meta descriptions, Open Graph, Twitter, canonical, or JSON-LD on any of the 13 HTML pages.** For a brand that must out-rank similarly named "Gateway Ltd" companies, this is the single biggest gap. | all `*.html` |
| 3 | High | **Academy content is published on two hosts** (`thegatewayltd.com/academy/…` per the parent sitemap, and `academy.thegatewayltd.com/…` per the Academy sitemap) with no canonical tags → duplicate-content risk. | `sitemap.xml`, `academy/sitemap.xml` |
| 4 | High | **Paystack success is unverified.** The "You're registered! 🎉" overlay fires from the client-side `callback`; there is no server-side verify, webhook, or database. Enrolment data lives only in Paystack transaction metadata. | `academy/auth/payment.html:606-611` |
| 5 | High | **The Supabase auth funnel is dead.** `assets/js/config.js` still holds `YOUR_SUPABASE_…` placeholders, so `auth.js` throws on load; yet `admissions.html` → `auth/signup.html` / `auth/login.html` are in the Academy sitemap and indexed. | `academy/auth/*`, `academy/sitemap.xml` |
| 6 | High | **Stale/contradictory Academy content:** `admissions.html` says "Media Production **2025**" with "placeholder" fees (₦10,000 / ₦50,000 / ₦350,000) vs live pricing of ₦528,000 / ₦955,000 / ₦1,391,000; deadline "July 23, 2026" and "July starts in weeks" are now past (today is 2026-09-19). | `academy/admissions.html`, `academy/index.html:699`, `academy/media-production/index.html:666` |
| 7 | Med | **"Notify Me" forms on all four coming-soon pages do nothing** (`onsubmit="return false;"`). Emails are silently discarded. | `comms|studios|spaces|photography/index.html` |
| 8 | Med | **Cross-site links are relative** (`../index.html`, `../assets/css/main.css`). They only work if each subsidiary is served from the repo root under a path. On a subdomain whose project root is the subsidiary folder, CSS 404s and "Back to Gateway Ltd" links to itself. | all coming-soon pages, `academy/admissions.html`, `academy/auth/*` |
| 9 | Med | **29 MB of unoptimised images** in `academy/trainers/` (one headshot is 10.6 MB, shown at ~200 px tall). | `academy/trainers/` |
| 10 | Med | **Brand facts conflict:** hero says "Est. 2024" but stat says "10+ Years active"; "5 Companies" active while 4 are "coming soon"; three different contact-email/domain spellings. | `index.html` |

---

## 1. Project structure

### 1.1 File tree (excluding `.git`, `.venv`, `node_modules`, build output)

```
Gateway_LTD/
├── index.html                      Parent site home (30 KB, inline page CSS + inline JS)
├── sitemap.xml                     Parent sitemap (www.thegatewayltd.com)
├── gateway.jpeg                    55 KB — unreferenced
├── Gateway Brand Colour.jpg        1.2 MB — brand swatch sheet, unreferenced (publicly servable)
├── Gateway Brand Guide.pdf         7.1 MB — brand guide, unreferenced (publicly servable)
├── assets/                         "shared" folder — used by parent + coming-soon + some Academy pages
│   ├── css/main.css                12.6 KB shared stylesheet ("GATEWAY LTD — SHARED STYLESHEET")
│   ├── js/config.js                Supabase/Paystack constants — PLACEHOLDERS ONLY
│   ├── js/payment.js               GatewayPayment module — loaded by NO page (dead code)
│   ├── icon/icon (2).png           favicon / nav emblem (49 KB)
│   ├── icon/icon.jpeg              645 KB — unreferenced
│   ├── images/hero_banner.jpg      1.7 MB — parent hero background
│   ├── images/academy_hero.png     2.4 MB — unreferenced here (duplicate of academy/trainers/academy_hero.png)
│   └── logo/THE GATE WAY ACADEMNY LOGO-01.png   224 KB — unreferenced here (duplicate)
├── academy/                        THE GATEWAY ACADEMY (finished)
│   ├── index.html                  Academy home (52 KB)
│   ├── main.css                    12.6 KB — near-copy of assets/css/main.css (1 line differs)
│   ├── admissions.html             44 KB — orphaned, stale (2025, placeholder fees)
│   ├── sitemap.xml                 Academy sitemap (academy.thegatewayltd.com)
│   ├── media-production/
│   │   ├── index.html              Programme page (65 KB, inline CSS ≈ 250 lines)
│   │   └── me                      STRAY older copy of the page (no GA tag), not linked
│   ├── auth/
│   │   ├── payment.html            LIVE checkout (Paystack) — the real funnel
│   │   ├── signup.html, login.html, forgot-password.html, reset-password.html   Supabase auth (non-functional)
│   │   └── auth.js                 GatewayAuth module (Supabase)
│   ├── icon/                       duplicate of assets/icon (identical md5)
│   ├── logo/                       Academy logo + 11 partner-logo files (5 unreferenced)
│   └── trainers/                   trainer photos + hero/space images (29 MB) — misnamed folder
├── comms/index.html                "Coming soon" (115 lines)
├── studios/index.html              "Coming soon" (115 lines)
├── spaces/index.html               "Coming soon" (141 lines, adds stat row)
├── photography/index.html          "Coming soon" (143 lines, adds icon + service tags)
├── .vscode/settings.json           Live Server port 5502
└── .claude/settings.local.json     (git-ignored)
```
`.venv/` (Python 3.14, contains only `pip`) is git-ignored and unrelated to the site.

### 1.2 One repo or several?
**One repo, one folder per site.** There are no submodules, workspaces, or per-site config files. Parent = repo root. Each subsidiary = a top-level folder (`academy/`, `comms/`, `studios/`, `spaces/`, `photography/`).

### 1.3 How sites are organised / served (inferred — not provable from code)
| Evidence | Implies |
|---|---|
| `sitemap.xml` (root) lists `https://www.thegatewayltd.com/academy/index.html`, `/comms/index.html`, etc. | The parent deployment serves the **whole repo**, so subsidiary folders are reachable as **paths** on the parent domain. |
| `academy/sitemap.xml` lists `https://academy.thegatewayltd.com/auth/signup.html`, `/media-production/index.html` | The Academy subdomain's web root is the **`academy/` folder** (probably a second Vercel project with Root Directory = `academy`, or a domain alias). |
| Parent card links to `https://academy.thegatewayltd.com/` (`index.html:317`) but footer/mobile menu link to `academy/index.html` | Both hosts are live and used. |
| Parent lists `comms.gatewayltd.com`, `studios.gatewayltd.com`, `spaces.gatewayltd.com`, `photography.gatewayltd.com` as domains (note: **missing "the"**) | Subdomains are *intended* for the four coming-soon sites, but currently they link to relative folders. Not confirmed live. |

### 1.4 Tech stack
- **Plain static HTML + CSS + vanilla JS.** No framework, no bundler, no `package.json`, no lockfile, no build step.
- **Runtime CDNs:** Google Fonts (Inter); `cdn.jsdelivr.net/npm/@supabase/supabase-js@2` (auth pages); `js.paystack.co/v1/inline.js` (payment page); `googletagmanager.com` (Academy pages).
- **Third-party services:** Paystack (payments), Supabase (auth — configured but not live), Google Analytics 4 (Academy only, ID `G-QJ2R2E2GVH`), Unsplash hot-linked images.
- **Dev tooling:** VS Code Live Server on port 5502 (`.vscode/settings.json`).

---

## 2. The reference sites: parent + Academy

### 2.1 Pages and section-by-section layout

#### Parent — `index.html` (`<title>The Gateway Ltd — Synthesizing Potential, Powering Africa</title>`)
Order of sections:
1. **Custom cursor** (`#cursor`, `#cursorRing`) — desktop only.
2. **Nav** `#navbar` — logo (`icon (2).png` 35×35 + wordmark "The Gateway **Ltd**"), links: Ecosystem `#subsidiaries`, Experiences `#about`, Our story `#mission`, Contact `#contact` (`.nav-cta`), hamburger.
3. **Mobile menu** `#mobileMenu` — "Navigate" links + "Our subsidiaries" list (5 items with icon + domain text) + "Contact us" CTA.
4. **Hero** `.hero#hero` — background `assets/images/hero_banner.jpg` under a white gradient; grid lines, diagonal lines, dot field, two glows; eyebrow "The Gateway Ltd — Nigeria"; H1 "Your Gateway / *to Creative* / Growth." (3 masked lines); sub "We build Experiences that power creativity, work and growth"; stats 5+ Subsidiaries / 10+ Years active / 1K+ Clients served; CTAs "Explore Ecosystem" (`.btn-primary`) + "Contact Us" (`.btn-secondary`); vertical tag "Abuja, Nigeria — Est. 2024"; scroll indicator.
5. **Ticker** `.ticker-wrap` (yellow) — the five subsidiary names, repeated.
6. **Mission** `.mission#mission` (charcoal + 12 % Unsplash photo) — kicker "Our purpose"; H2 "We remove friction between *creativity, work,* and growth."; 2 paragraphs; CTA "Start a conversation"; right column = 4 numbered pillars (Structure, Clarity, Direction, Legacy).
7. **Subsidiaries** `.subsidiaries#subsidiaries` (cream) — kicker "The ecosystem"; H2 "Five experiences. *One Gateway.*"; 3-col grid of `.sub-card` ×5 (+ `.sub-grid-spacer`). Each card: 7 % Unsplash background, big ghost number, 40 px icon tile, tag, name, description, footer with "Explore →" link + domain text.
8. **Info strip** `.info-strip` — Headquarters / Parent company / Domain / Active subsidiaries / Focus.
9. **Footer** `footer#contact` — brand + tagline; columns Subsidiaries, Company (Our story, Careers `#`), Contact (`hello@gatewayltd.com`, Google-Maps address link, Media enquiries `#`, Partnerships `#`); bottom bar © 2025, Privacy `#`, Terms `#`, Sitemap.

#### Academy home — `academy/index.html` (`Gateway Academy — Equipping the Next Generation of Creatives`)
1. Nav: image logo (`logo/THE GATE WAY ACADEMNY LOGO-01.png`), Programs `#programs`, Resources `#` (dead), Contact `#contact`, **"Gateway Ltd" parent pill** (`.nav-parent-link` → `https://www.thegatewayltd.com/`), "Apply Now" → `auth/payment.html`. (A "Sign In" `<li>` is commented out, lines 484–485.)
2. Hero `#hero` — `trainers/hero_banner.png` + white gradient (same recipe as parent); badge "Now enrolling — Media Production 2026"; H1 "Equipping young / Africans to *create,* / *lead* and *shape* the future."; sub; CTAs "Apply for Media Production" (`.btn-yellow`) + "Learn more"; stats 4+ Programs / 10+ Industry trainers / 100% Practical curriculum; giant faint letter "A" with scroll parallax.
3. Ticker (Media Production — Web Development — Data Analysis — Cyber Security — Gateway Academy — Abuja, Nigeria).
4. **About** `#about` (white) — H2 "More than learning. *A place to grow.*"; 3 paragraphs; 4 `.about-card`s (Expert-Led Training, Modern Infrastructure, A Driven Community, Industry-Relevant Curriculum).
5. **Programs** `#programs` (cream) — `.prog-featured` Media Production (charcoal card, yellow left bar, "Open for applications", 20-student cohort, Abuja, deadline card "July 23 2026", "Program starts July 2026", Apply + Learn More) + 3 `.prog-card`s marked "Admissions closed" (Web Development, Data Analysis, Cyber Security).
6. **Facility** (charcoal + Unsplash bg) — H2 "Built for *serious learners.*"; 6 tick items (solar, fibre, A/C, etc.); 3-photo mosaic (`.fp-1`, `.fp-3` local photos, `.fp-2` Unsplash).
7. **Trainers** — 3 `.trainer-card`s (Kazahzachat Solomon Kabantiok, Gabriel Orter Atser, Samuel Adedoyin Kugbiyi) with photo, role, bio.
8. **CTA banner** `.cta-banner` — "Ready to begin your creative journey?", Apply Now / Learn more, note "applications close July 23, 2026".
9. Footer — logo, "Academy · A Gateway Ltd Company", Programs, Contact (`academy@thegatewayltd.com`, address), **social icons** (Instagram, Facebook, TikTok, LinkedIn), © 2026, "Back to Gateway Ltd".

#### Media Production — `academy/media-production/index.html` (`Media Production — Gateway Academy, Abuja`)
Nav (dark-on-hero variant, turns light on scroll) → **urgency strip** (yellow, live countdown to `2026-07-24`) → hero with dark overlay (`trainers/academy_hero.png`) + "Course Tracks" mock window card (`.studio-card`, three traffic-light dots) with early-bird price → ticker → **credibility** logo row (Gates Foundation, Sightsavers, Mercy Corps, Sasakawa, UNHCR, UNDP on white slots) → Who it's for (2 cards) → Why Media (4 cards) → **Courses** `#courses` (3 `.course-card`s, "Most Popular" on Production, syllabus bullet lists) → What you'll gain (6 `.gain-card`s) → **Enrolment** `#register` (3 `.bundle-card`s: Single ₦528,000 / Bundle ₦955,000 / Full Pipeline ₦1,391,000 with strike-through "was" prices; each links `../auth/payment.html?course=single|bundle|fullpipeline`) → FAQ accordion (6 Qs) → CTA banner → footer. Leftover `.testimonials-section` / `.testi-*` CSS remains (testimonials were removed in commit `00b3e67`).

#### Checkout — `academy/auth/payment.html` (`Complete Payment — Gateway Academy`)
Charcoal top bar with **inline SVG "Gateway" wordmark**; two-column layout: sticky **order summary** (`.order-card`) + **payment form** (`.payment-card`): course tabs → track selector (conditional) → name / email / phone → "How did you hear about us?" (5 tabs + referrer field) → red pay button → security note → `.success-overlay` modal. See §2.6.

#### Admissions — `academy/admissions.html` (orphaned)
Hero → 4-step process → requirements → fees (explicitly labelled "⚠ Placeholder fees — confirm with admissions before applying") → FAQ → CTA. Copy says "Media Production **2025**". Not linked from any live page. Uses `academy@gatewayltd.com`.

#### Auth pages — `academy/auth/{login,signup,forgot-password,reset-password}.html`
Split-screen (brand panel + form) using `.apl-*` / `.auth-*` classes inline; all load Supabase JS + `../../assets/js/config.js` + `auth.js`. Non-functional until config is filled (see §2.6).

#### Coming-soon pages ×4 — see §3.

### 2.2 Design system

**Source of truth:** `:root` in `assets/css/main.css:12-20` (duplicated in `academy/main.css`, `academy/auth/payment.html:26-37`, and `academy/media-production/index.html:28-35`).

**Colour tokens**
| Token | Value | Use |
|---|---|---|
| `--red` | `#E51524` | primary brand, CTAs, kicker lines, `<em>` accents |
| `--red-dark` | `#8B0A1E` | button hover |
| `--red-muted` | `rgba(229,21,36,0.08)` | icon-tile hover, badges |
| `--yellow` | `#FFAB00` | ticker bg, hero accent bar, `.btn-yellow`, cursor dot, highlights on dark |
| `--yellow-dark` | `#CC8800` | yellow hover |
| `--yellow-muted` | `rgba(255,171,0,0.10)` | tints |
| `--charcoal` | `#1A1714` | text, dark sections, footer |
| `--charcoal-soft` | `#2C2925` | nav links (media page) |
| `--cream` | `#F8F6F2` | page bg, light sections |
| `--cream-dark` | `#EDE9E2` | icon tiles, info strip, FAQ bg |
| `--stone` | `#9B9590` | secondary text, labels |
| `--stone-light` | `#C8C4BE` | muted text |
| `--white` | `#FFFFFF` | cards |
| `--border` / `--border-light` | `rgba(26,23,20,0.10)` / `0.06` | 1 px hairlines |
| `--nav-h` | `72px` (`60px` ≤680px) | nav height |
| *(media page only)* `--text-body` `#3A3632`, `--border-dark` `rgba(255,255,255,.08)` | | body text / dark borders |
| *(hard-coded, not tokens)* `#3A3632` body copy on cards; `#16a34a` success green; `#ff5f57`/`#28c840` window dots | | |

Brand-sheet cross-check (`Gateway Brand Colour.jpg`): yellow `#FFAB00` matches. The red swatch is **mislabelled "RGB: ffab00"** in the image; its tints (`#E52E43`, `#E55C6B`, `#E58994`, `#E5B7BC`, `#E5CED1`) are consistent with `#E51524` but the base hex isn't printed correctly. The brand guide PDF could not be read here (no PDF tooling and installs were forbidden) — see §Open questions.

**Typography**
- Single family: **Inter** from Google Fonts — `family=Inter:wght@300;400;500;600;700;800&display=swap` (preconnect to `fonts.googleapis.com` + `fonts.gstatic.com`). Coming-soon pages load 300–700 only.
- Headlines: weight **800**, tracking **-.03em to -.035em**, line-height ~1.03–1.08. Accent words use `<em>` restyled to `font-style:italic; font-weight:300` in red (light bg) or yellow (dark bg) — a signature look. Academy home hero uses `em{font-style:normal}` instead.
- Scale (px): hero H1 `clamp(48,7vw,88)` (parent) / `clamp(32,4vw,58)` (Academy); section H2 `clamp(28–32,3.5–4vw,46–52)`; CTA H2 `clamp(28,4vw,52)`; stat numbers 28–30; body 14–17 (weights 300–500); small copy 11–13.
- Micro-labels: **9–11 px, uppercase, letter-spacing .12–.24em**, weight 500–700 (kickers, buttons, tags, nav links, footer titles).

**Spacing / layout**
- `.container{max-width:1280px;padding:0 40px}` (24 px ≤680).
- `.section-pad{padding:100px 0}` (72 px ≤680). Grid gaps 12/16/20/36/48/80 px.

**Radius:** buttons/inputs **2px**; cards/tiles **4px**; featured card, trainer card, modal **6px**; dots/cursors **50%**.

**Shadows:** the system is deliberately flat (1 px borders, not shadows). Exceptions: `.success-modal` `0 32px 80px rgba(0,0,0,.25)`, `.floating-badge` `0 6px 22px rgba(255,171,0,.35)`, `.btn-enrol:hover` `0 6px 20px rgba(229,21,36,.3)`, nav `backdrop-filter: blur(16px)` on scroll.

**Breakpoints** (max-width): **960px** (tablet), **680px** (mobile; also flips `--nav-h` and shows hamburger), plus one-offs 820 (payment), 800, 520, 500, 480; `@media(pointer:coarse)` hides the custom cursor.

**Motion tokens:** easing `cubic-bezier(.23,1,.32,1)` for reveals/bars; `ease` for fades; 0.2–0.4 s hovers; 0.6–0.9 s reveals.

### 2.3 Reusable components & where the code lives

| Component | Classes / ids | Defined in | Shared or copied? |
|---|---|---|---|
| Reset, tokens, cursor, nav, hamburger, mobile menu, buttons, ticker, `.container`/`.section-pad`, section kicker, `.reveal`, info strip, footer, keyframes | `nav#navbar`, `.nav-inner`, `.nav-logo`, `.nav-links`, `.nav-cta`, `.hamburger`, `.mobile-menu`, `.mob-*`, `.btn-primary/.btn-secondary/.btn-yellow`, `.ticker-*`, `.section-kicker/.sk-line/.sk-text`, `.reveal(.visible)`, `.reveal-delay-1..3`, `footer`, `.footer-*` | `assets/css/main.css` | **Copy-pasted** into `academy/main.css` (differs only on `.logo-emblem`), and tokens/nav are *re-declared inline* in `media-production/index.html` and `payment.html`. |
| Parent hero (light) | `.hero`, `.hero-image`, `.hero-grid`, `.hero-accent-bar`, `.hero-diag`, `.hero-dots`, `.hero-glow(-red)`, `.hero-eyebrow`, `.hero-headline(-line)`, `.hero-stats` | inline `<style>` in `index.html:16-50` | page-local |
| Academy hero (light) | `.hero`, `.hero-badge`, `.hero-bg-letter`, `.hero-year-tag`, `.hero-stats` | inline in `academy/index.html:55-108` | page-local (re-implements parent hero) |
| Academy hero (dark) | same names, overlay `rgba(26,23,20,.96→.65)`, `.hero-visual`, `.studio-card`, `.urgency-strip` | inline in `media-production/index.html` | page-local; **visually different from the other two heroes** |
| Subsidiary card | `.sub-card`, `.sub-card-bg/-num/-icon/-tag/-name/-desc/-footer/-link` | inline `index.html:66-121` | parent only |
| Programme cards | `.prog-featured`, `.prog-card`, `.prog-status` | inline `academy/index.html:165-244` | Academy only |
| About cards / facility items / trainer cards | `.about-card`, `.facility-item`, `.trainer-card` | inline `academy/index.html` | Academy only |
| CTA banner | `.cta-banner`, `.cta-banner-kicker/-headline/-sub/-actions/-note` | inline in `academy/index.html:358-383` **and** `media-production/index.html` | **duplicated** |
| Pricing cards | `.bundle-card`, `.btn-enrol`, `.bundle-price/-was/-includes` | inline `media-production/index.html` | page-local |
| FAQ accordion | `.faq-item/.faq-question/.faq-answer`, `toggleFaq()` | inline `media-production/index.html:150-164, 746`; also in `admissions.html` | **two different implementations** |
| Credibility logo row | `.credibility`, `.logo-slot` | inline `media-production/index.html` | page-local |
| Parent-site pill | `.nav-parent-link`, `.footer-parent-link` | inline in each Academy page | **copy-pasted 3×** |
| Footer overrides (3-col, socials) | `.footer-top{1.6fr 1fr 1fr}`, `.social-link` | inline `academy/index.html:388-402` | Academy only |
| Coming-soon template | `.cs-page/.cs-nav/.cs-main/.cs-badge/.cs-headline/.cs-form/.cs-footer` | inline in each of 4 pages | **copy-pasted 4×** (≈95 % identical) |
| Checkout UI | `.order-card`, `.course-tab`, `.track-option`, `.source-tab`, `.pay-btn`, `.success-overlay` | inline `payment.html` | single use |
| Auth UI | `.apl-*`, `.auth-*` | inline in each auth page | copy-pasted ×4 |
| Modal | `.success-overlay/.success-modal` only (no generic modal) | `payment.html` | single use |
| Forms | `.pay-input`, `.auth-input`, `.cs-input` | three unrelated styles | not unified |

**Bottom line:** there is a genuine shared layer (`assets/css/main.css`) but each page still carries 200–300 lines of inline CSS, and the shared file has been forked once (`academy/main.css`).

### 2.4 Animations, interactions, JS behaviour
All JS is inline (an IIFE at the bottom of each page), identical across parent/Academy:
- **Custom cursor:** 8 px yellow dot + 32 px red ring (lerp factor .12 via `requestAnimationFrame`); grows on hover over `a, button, .sub-card`/`.trainer-card`/…; hidden ≤680px and on `pointer:coarse`.
- **Nav:** `.scrolled` toggled after 40 px scroll (white blur bar).
- **Mobile menu:** open/close toggles `.open`, `aria-hidden`, locks `body` scroll; global `closeMobileMenu()`.
- **Scroll reveal:** one `IntersectionObserver` (threshold .1) adds `.visible` to `.reveal, .sub-card, .mp-item, .about-card, .prog-card, .facility-item…`; staggered `transitionDelay` set from JS.
- **Smooth anchor scrolling** for `a[href^="#"]`.
- **Hero:** masked line-by-line reveal (`lineReveal`), growing yellow bar (`barGrow`), fade/slide-ups, scroll-indicator pulse; Academy adds a scroll parallax on the giant "A"/"M" letter (`scrollY*.2`).
- **Ticker:** CSS-only marquee (`tickerMove` 20–22 s linear infinite).
- **Media page:** live countdown to `2026-07-24` (falls back to "Now Enrolling"), FAQ accordion (`toggleFaq`).
- **Payment page:** tab/track/source selection, validation, Paystack popup, success modal (`modalPop`, `glowPulse`).
- **Keyframes in `main.css`:** `tickerMove, barGrow, fadeIn, slideUp, lineReveal, scrollPulse, pulse` (`slideUp` is re-defined with a different offset in `academy/index.html:78`).
- **Gaps:** no `prefers-reduced-motion` handling anywhere; `.reveal` content is `opacity:0` until JS runs (blank without JS).

### 2.5 Images and assets
| Where | What | Notes |
|---|---|---|
| `assets/icon/icon (2).png` | favicon + parent nav emblem | referenced with `type="image/x-icon"` although it's a PNG |
| `assets/images/hero_banner.jpg` | parent hero | 1.7 MB |
| `academy/logo/THE GATE WAY ACADEMNY LOGO-01.png` | Academy logo (nav/footer) | 224 KB; **filename typo "ACADEMNY"**, spaces in name |
| `academy/trainers/` | trainer photos `solomon.JPEG` (4.8 MB), `Gabriel.jpeg` (**10.6 MB**), `Sam.jpeg` (0.2 MB); heroes `hero_banner.png` (2.1 MB), `academy_hero.png` (2.4 MB); facility `space (1).jpg` (2.6 MB), `space (2).jpg` (2.9 MB) | folder name doesn't match contents; `hero_img.png`, `media_hero.png` unreferenced |
| `academy/logo/` partner logos | used: `Gates_Foundation_Logo.svg`, `sightsavers-seeklogo.svg`, `mercy-corps-seeklogo.svg`, `sasakawa-…png`, `UNHCR.svg`, `undp-seeklogo.png` | **unreferenced:** `GatesFoundationlogo.svg`, `Sightsavers_logo.jpg`, `sightsaver.png`, `sightsavers-seeklogo.png`, `undp-seeklogo.svg` |
| Unsplash hot-links | parent mission bg + 5 card backgrounds; Academy featured-card, facility, mosaic photo 2, CTA-banner bg; media CTA bg | external dependency, no licence record in repo |
| Inline SVG | all icons (stroke style, `stroke-width` 1.6–2.2); Gateway wordmark on `payment.html` | no icon sprite; repeated inline |
| Emoji | used as icons in `payment.html` and `media-production` (`&#127916;` etc.) | renders differently per OS |
- **Duplicates:** `assets/icon/*`, `assets/logo/*`, `assets/images/academy_hero.png` are byte-identical (md5) to copies under `academy/`.
- **Naming:** no convention (mixed case, spaces, parentheses, typos). No modern formats (WebP/AVIF), no `srcset`. **All content imagery is CSS `background-image`**, so no `<img alt>` for photos/trainers.

### 2.6 Academy payment flow (Paystack)

**Files involved**
| File | Role |
|---|---|
| `academy/auth/payment.html` | The **only live** payment code. Inline `<script>` at lines 425–630. |
| `assets/js/payment.js` (`GatewayPayment.initiatePayment`) | A cleaner module, **not loaded by any page** — dead code. |
| `assets/js/config.js` | Declares `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PAYSTACK_PUBLIC_KEY` — all still `'YOUR_…'` placeholders. **`payment.html` ignores it.** |

**Key handling:** a **live-mode public key (`pk_live_…`) is hard-coded** at `academy/auth/payment.html:432` (declared again as a page-local `const PAYSTACK_PUBLIC_KEY`). Paystack public keys are designed to be exposed in the browser, so this is not a leak; no `sk_` secret key appears in the working tree or in any of the 41 commits. Git history also shows earlier `pk_live_REPLAC…` placeholders and old Selar payment links (`selar.com/…`) that were replaced by Paystack in commit `bb81094`.

**Flow**
1. Entry points: nav/hero/CTA "Apply Now" → `auth/payment.html`; pricing cards → `?course=single|bundle|fullpipeline` (read by `init()` via `URLSearchParams`).
2. User picks package (`COURSES`: single ₦528,000, bundle ₦955,000, fullpipeline ₦1,391,000), a track (`TRACK_OPTIONS`: 3 tracks for single, 2 combos for bundle, none for full), enters name / email / phone, and "how did you hear" (`SOURCE_LABELS`, plus referrer name).
3. `initiatePayment()` validates client-side (name, email regex, phone non-empty, track, source, referrer).
4. `PaystackPop.setup({ key, email, amount: course.amount*100, currency:'NGN', ref:'GA-'+COURSE3+'-'+Date.now(), metadata.custom_fields:[Full Name, Phone, Package, Track(s), How They Heard, Referrer, Academy] })` → `handler.openIframe()`.
5. `callback(response)` → shows `#successOverlay` with `response.reference`; `onClose` re-enables the button.

**Backend / serverless:** **none.** No `fetch`, no `/api`, no Supabase functions, no webhook, no verify call, no persistence.
**Consequences:** (a) success is trusted from the client; (b) the only record of an enrolment is the Paystack dashboard metadata — no email/CRM/DB; (c) the page claims "a receipt is on its way" (Paystack sends one, but nothing from Gateway does); (d) prices are hard-coded in **three** places (`payment.html` `COURSES`, `media-production` HTML, stale `admissions.html`); (e) GA is loaded on the page but no `purchase`/`begin_checkout` event is sent; (f) `<input id="pay-phone" pattern="\d{11}" required>` is **not inside a `<form>`**, so native validation never runs (only "non-empty" is checked in JS; the 11-digit rule is `maxlength` only).

**Supabase auth (dormant):** `auth.js` builds `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)` at load → with placeholders it throws, so `GatewayAuth` is undefined and every auth form fails. `forgotPassword` sets `redirectTo: window.location.origin + '/academy/auth/reset-password.html'`, which would 404 on the Academy subdomain (root = `academy/`). `login()` default redirect `../dashboard.html` doesn't exist (the page overrides it to `payment.html`).

### 2.7 Linking between sites
| From → To | How | Issue |
|---|---|---|
| Parent → Academy (desktop card) | `https://academy.thegatewayltd.com/` (`index.html:317`) | absolute ✔ |
| Parent → Academy (mobile menu, footer) | `academy/index.html` (relative) | sends users to the **path** copy, not the subdomain — inconsistent |
| Parent → Comms/Studios/Spaces/Photography | `comms/index.html` etc. (relative) | not subdomains |
| Parent card domain labels | `academy.gatewayltd.com`, `comms.gatewayltd.com` … | **wrong domain** (missing "the") |
| Academy index → parent | nav pill + mobile menu → `https://www.thegatewayltd.com/` ✔ ; footer "Back to Gateway Ltd" → `../index.html` | footer link resolves to the Academy itself when served from the subdomain |
| Academy `media-production` → parent | nav pill "Gateway Ltd" and footer → `../index.html` | **goes to Academy home, not the parent**, on both hosts |
| Academy `admissions`, `auth/*` → parent | `../index.html` | same problem |
| Coming-soon pages → parent | `../index.html` ("Back to Gateway Ltd", logo, footer) | relative; breaks on a dedicated subdomain |

---

## 3. The four "coming soon" subsidiaries

### 3.1 What exists right now
Each is **one file**: `<folder>/index.html`. No CSS/JS/image files of their own. No favicon, no GA, no meta description. Each links `../assets/css/main.css` (tokens + shared classes) and carries ≈90 lines of inline `.cs-*` CSS. There is **no JavaScript** at all (the cursor CSS is present but no cursor elements exist).

| Subsidiary | Folder | `<title>` | Big bg word | Headline | Description on page | Extras | Accent |
|---|---|---|---|---|---|---|---|
| Gateway Communications | `comms/` | Gateway Communications — Coming Soon | COMMS | "Your Message, *Amplified*" | "…a full-service media and PR agency helping brands, businesses, and individuals craft compelling narratives, build audiences, and command attention across every channel that matters." | — | yellow |
| Gateway Studios | `studios/` | Gateway Studios — Coming Soon | STUDIOS | "Where Ideas Become *Reality*" | "…our creative production powerhouse — a full-service studio space built for filmmakers, musicians, podcasters, and content creators who demand world-class facilities and collaborative energy." | — | red |
| Gateway Spaces | `spaces/` | Gateway Spaces — Coming Soon | SPACES | "Curated Spaces for *Exceptional* Work" | "…premium co-working, event, and office environments designed to inspire productivity and foster collaboration." | stats row: **3 Locations · 200+ Desk Seats · 24/7 Access** | red (+ second yellow glow) |
| Gateway Photography | `photography/` | Gateway Photography — Coming Soon | PHOTO | "Every Frame Tells a *Story*" | "…a professional photography studio and agency delivering editorial, commercial, and event photography of the highest standard." | camera-lens icon; tags: Editorial, Commercial, Events, Portraits, Brand Campaigns | mixed red/yellow |

Common structure: `.cs-page` (charcoal, min-height 100vh) → `.cs-nav` (wordmark "GATEWAY LTD │ <Sub>" + "Back to Gateway Ltd") → `.cs-main` (badge "Coming Soon" with pulsing dot, eyebrow, H1, 40 px divider, description, **Notify Me** email form) → `.cs-footer` ("© 2025 Gateway Ltd", "Gateway Ltd →").

### 3.2 Copy / notes about what each does (parent site + Academy)
| Subsidiary | Parent card (`index.html`) | Other hints |
|---|---|---|
| Communications | tag "Communications" — "Strategic corporate communications delivered by experts." | Mission pillar "Clarity": "Strategic communication ensuring every message lands with precision, trust, and lasting institutional impact." |
| Studios | tag "Creative production" — "Capturing authentic stories through cinematic documentary & filmmaking." | Academy FAQ: "The Gateway Academy operates within **The Gateway Studios** at Suite 203A/204A Bahamas Plaza… fully equipped with off-grid solar power, high-speed fibre internet, and professional-grade production equipment." Academy bundles include a "Studio Residency". |
| Spaces | tag "Spaces" — "Creative spaces designed for collaboration, focus, and inspiration." | Info-strip focus: "Media, Comms & Creative". |
| Photography | tag "Visual arts" — "Authentic visual storytelling — capturing the moments, people, and ideas that define our culture." | — |
| All | Hero: "We build Experiences that power creativity, work and growth"; Mission: "systems that allow individuals, teams, and organizations to think clearly, create freely, and execute effectively… From Abuja to the rest of Africa". Subs-intro: "Each subsidiary operates independently, powered by the same strategic infrastructure and shared vision for excellence." | HQ: Suite 203A, Bahamas Plaza, Joseph Gomwalk St, Gudu, Abuja. |

**Inconsistencies to resolve before building:** Studios is "documentary & filmmaking" on the parent but "studio-space rental for musicians/podcasters" on its own page; Photography, Spaces and Communications similarly differ in emphasis. The Spaces stats (3 locations, 200+ seats, 24/7) and "1K+ clients" / "10+ years" are unverified claims. There are **no logos, brand marks, colour assignments, or copy files** for the four subsidiaries anywhere in the repo (only the Academy has a logo).

### 3.3 Where each is meant to be served
- Parent text says `comms|studios|spaces|photography.gatewayltd.com` (probable typo for `.thegatewayltd.com`), mirroring the Academy's `academy.thegatewayltd.com`.
- Today they are reachable only as **paths**: `thegatewayltd.com/comms/`, etc. (parent sitemap lists `/comms/index.html`…).
- No Vercel config, DNS notes, or redirects exist in the repo. See Open questions.

---

## 4. Deployment and config

| Item | Finding |
|---|---|
| `vercel.json` | **Does not exist** (nor in git history). No rewrites, redirects, headers, `cleanUrls`, or `trailingSlash` settings. |
| `package.json`, build scripts, framework preset | **None** — Vercel would treat it as a static site (or you deploy via another host; unknown). |
| `robots.txt` | **Missing** (all sites). |
| Headers | None set: no CSP, no cache-control for the 29 MB of images, no security headers. |
| Redirects | None: `/index.html` and `/` both serve the home page; no `www`↔apex rule visible. Parent sitemap uses `www.`; the Academy pill links to `https://www.thegatewayltd.com/`. |
| Domains referenced in code | `www.thegatewayltd.com`, `academy.thegatewayltd.com`; text-only: `comms|studios|spaces|photography.gatewayltd.com`. |
| Environment variables | **None** are read anywhere (no `process.env`). The equivalents are three hard-coded constant *names*: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `PAYSTACK_PUBLIC_KEY` (in `assets/js/config.js`, plus a page-local `PAYSTACK_PUBLIC_KEY` in `payment.html`). Vercel env vars can't reach a no-build static site, so keys must stay in source or a build step must be introduced. |
| Third-party IDs in source | GA4 `G-QJ2R2E2GVH` (Academy index, media-production, payment only). |
| How each site is deployed | **Cannot be determined from the repo.** The commit history ("Logo correction for deployment", "change logo and directory", "sitemap directory") and the two sitemaps strongly suggest: GitHub → Vercel auto-deploy on push to `main`; parent = repo root; Academy = a second project/domain with Root Directory `academy/`. Unverified. |
| Publicly served non-site files (if repo root is the web root) | `Gateway Brand Guide.pdf` (7 MB), `Gateway Brand Colour.jpg`, `gateway.jpeg`, `.vscode/settings.json`, `academy/media-production/me`, `assets/js/config.js`. |

**Risk if Academy's root = `academy/`:** `admissions.html` and `auth/*.html` reference `../assets/css/main.css` / `../../assets/css/main.css` (outside that root → 404, unstyled nav/footer), and `forgotPassword`'s `redirectTo` uses `/academy/auth/…`. The main funnel pages (`index.html`, `media-production`, `payment.html`) use only files inside `academy/`, which is why the live funnel works.

---

## 5. SEO

### 5.1 Per-page inventory
| Page | `<title>` | meta description | OG / Twitter | canonical | JSON-LD | favicon | GA |
|---|---|---|---|---|---|---|---|
| `index.html` (parent) | "The Gateway Ltd — Synthesizing Potential, Powering Africa" | ✗ | ✗ | ✗ | ✗ | ✔ PNG (typed `x-icon`) | ✗ |
| `academy/index.html` | "Gateway Academy — Equipping the Next Generation of Creatives" | ✗ | ✗ | ✗ | ✗ | ✔ | ✔ |
| `academy/media-production/index.html` | "Media Production — Gateway Academy, Abuja" | ✗ | ✗ | ✗ | ✗ | ✔ | ✔ |
| `academy/auth/payment.html` | "Complete Payment — Gateway Academy" | ✗ | ✗ | ✗ | ✗ | ✔ | ✔ |
| `academy/admissions.html` | "Admissions — Gateway Academy" | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `academy/auth/{login,signup,forgot-password,reset-password}.html` | "Login/Apply/Forgot Password/Reset Password — Gateway Academy" | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `comms|studios|spaces|photography/index.html` | "Gateway <X> — Coming Soon" | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

No `<meta name="robots">` anywhere; no `noindex` on transactional/auth pages; no `theme-color`; no `apple-touch-icon`; no `hreflang`; `lang="en"` only (Nigeria → consider `en-NG`).

### 5.2 Sitemaps
- `sitemap.xml` (root): host `https://www.thegatewayltd.com`, 12 URLs. Problems: lists **both `/` and `/index.html`**; lists `academy/auth/payment.html` and three `?course=` query variants (thin, transactional URLs); lists `/academy/…` path copies that duplicate the subdomain; identical `<lastmod>` on everything (`2026-09-08T13:51:10+00:00`); includes the placeholder-quality coming-soon pages; references a third-party stylesheet (`xml-sitemaps.com/css/sitemap.css`). Generated by a free online tool, so it goes stale on every content change.
- `academy/sitemap.xml`: host `https://academy.thegatewayltd.com`, 10 URLs. Problems: includes `/` **and** `/index.html`; includes **`admissions.html`** (stale, contradictory fees), **`auth/signup.html`, `auth/login.html`, `auth/forgot-password.html`** (non-functional, no SEO value); omits nothing important but never lists `payment.html` without a query.
- No `Sitemap:` directive anywhere (no `robots.txt`).

### 5.3 Brand-name ranking issues ("Gateway Ltd" is a crowded name)
1. **Name inconsistency:** visible as "The Gateway Ltd" (title, footer), "Gateway Ltd" (coming-soon nav, footer, sitemap labels), "Gateway Academy" vs "The Gateway Academy" (bios/footers), and domain **`thegatewayltd.com`** vs the mis-typed **`gatewayltd.com`** (displayed subdomains and `hello@gatewayltd.com`, `academy@gatewayltd.com`). Pick one canonical entity name.
2. **No `Organization` structured data** (name, alternateName, url, logo, `sameAs` social profiles, address in Abuja, `parentOrganization`/`subOrganization`). This is the main lever to disambiguate from other "Gateway Ltd" companies. The Academy needs `EducationalOrganization`/`Course` markup (name, price ₦, provider, location), and pages need `LocalBusiness` address (Suite 203A, Bahamas Plaza, Joseph Gomwalk St, Gudu, Abuja).
3. **No location/descriptor in the parent `<title>`/H1** ("Abuja, Nigeria" appears only in a rotated tag). The home H1 ("Your Gateway to Creative Growth.") and `<title>` tagline ("Synthesizing Potential, Powering Africa") differ, and neither states what the company does.
4. **Content is image-only or JS-revealed:** trainer photos and hero images are CSS backgrounds (no alt text); `.reveal` elements start at `opacity:0`.
5. **Social profiles exist only for the Academy** (Instagram `academy.gatewayltd`, Facebook, TikTok `@gate_wayacademy`, LinkedIn `the-gateway-academy`); the parent has none linked, so no `sameAs` graph.
6. **Duplicate hosts** (see finding #3): declare one canonical per page.
7. Coming-soon pages have unique titles but no descriptions and no reason to index yet — either `noindex` them until built or give each a real description + canonical.
8. Footer "Sitemap" link points at the raw XML file.
9. GA4 only on Academy; parent traffic (the brand-query traffic that matters) is unmeasured; no Google Search Console/verification tag visible.

---

## 6. Quality issues

### 6.1 Broken / dead links & assets
A scripted resolve of every relative `href`/`src`/`url()` in all HTML and both CSS files found **no missing local files** in the folder-tree layout (the two "misses" the script flagged for `trainers/space\ \(1\).jpg` are valid CSS escapes; the files exist).
Functional dead ends:
- `index.html`: nav "Experiences" → `#about` — **no `id="about"` exists**; 7 `href="#"` placeholders (logo, Careers, Media enquiries, Partnerships, Privacy policy, Terms of use, …).
- `academy/index.html`: "Resources" `#` (desktop + mobile), 4 total `href="#"`.
- `academy/admissions.html`: 7 `href="#"`; footer "How to apply / Requirements / Fees / FAQs" all `#`; only Instagram social icon and it's `#`.
- `academy/auth/signup.html`: Terms of Service / Privacy Policy `#`.
- `academy/media-production/index.html` nav "Gateway Ltd" and footer "Back to Gateway Ltd" → Academy home (see §2.7).
- Coming-soon "Notify Me": no handler.
- Parent JS observes `.gallery-item` — not present in the HTML (harmless leftover).
- `assets/js/payment.js` never loaded; `academy/media-production/me` stray file; unused CSS (`.dropdown*`, `.di-*`, `.logo-emblem svg` in `main.css`; `.testi-*` in media page).

### 6.2 Content / accuracy
- **Stale dates** (as of 2026-09-19): deadline "July 23, 2026" (`academy/index.html:699,887`), "July starts in weeks / Registration closes soon" (`media-production/index.html:666`), urgency strip "July 2026 cohort now open" (its countdown falls back to "Now Enrolling" but the strip text and CTA remain), hero badge "Now enrolling — Media Production 2026", footer "Cohorts start July 2026". Payment page still says "Enrolment Open".
- `admissions.html`: "2025", placeholder fees, `academy@gatewayltd.com`.
- Parent: "Est. 2024" vs "10+ Years active"; "5 Companies" **Active** while 4 are coming soon; card numbers `sub-card-num` read 03, 02, 01, 04, 05 while the HTML comments say 01–05 in a different order; © 2025 (parent, coming-soon) vs © 2026 (Academy).
- Academy: stat "10+ Industry trainers" but 3 shown; "4+ Programs" but 3 closed; FAQ address "Suite 203A/204A" vs footer "Suite 203A"; Academy home footer says "young Nigerians" while hero says "young Africans".
- Trademark/permission: six third-party organisation logos are shown under "Trained by professionals who have worked with" — confirm you have the right to display them.

### 6.3 Accessibility
- **No `<main>` landmark** on parent/Academy pages (only the four coming-soon pages have one); no skip-to-content link.
- Hero/trainer/facility imagery is CSS background → no text alternative for trainers' faces.
- **Contrast:** `--stone #9B9590` on `--cream #F8F6F2` ≈ **2.7:1** (fails WCAG AA 4.5:1) yet is used for 9–11 px labels (`.mob-label`, `.info-label`, `.hero-stat-label` variants, `.subs-intro`); footer text at `rgba(255,255,255,.2–.3)` on charcoal (`.footer-copy`, `.footer-tagline`, `.cta-banner-note`) is far below AA.
- **Tiny type:** 9–10 px uppercase is used for functional text (buttons, nav links, tags).
- Keyboard: `payment.html` course tabs / track options / source tabs are `<div onclick>` (not focusable, no roles); FAQ buttons on `media-production` lack `aria-expanded` (admissions has it); hamburger lacks `aria-expanded`/`aria-controls`; the off-canvas mobile menu stays focusable while `aria-hidden="true"` (it's only translated off-screen at ≤680px).
- Focus styles: only `outline:none` overrides on inputs (`.cs-input`, `.pay-input`, `.auth-input`) with a border-colour change; no global `:focus-visible` treatment for links/buttons.
- Forms: coming-soon email input has a placeholder but **no `<label>`/`aria-label`**; payment errors (`#pay-error`) not announced (`role="alert"` missing).
- **No `prefers-reduced-motion`** anywhere despite large parallax/reveal/marquee animation; the marquee has no pause control.
- Custom cursor is decorative but the site keeps `cursor:default` so the system pointer stays — fine.

### 6.4 Responsive / performance
- Breakpoints are consistent at 960/680, and the mobile layouts were clearly worked on (commit "Fix mobile logo"). Gaps by inspection: parent `.hero` is `min-height:100vh` **and** its inner wrapper is inline `min-height:100vh` with extra padding → hero is taller than the viewport; `.footer-top` on the Academy overrides to 3 columns on desktop but the shared `1.5fr 1fr 1fr 1fr` remains on other pages; `.hero-year` (rotated tag) can collide with content on 680–960px; payment `source-tabs` is 5 columns until 500px (tight at ~500–600px); several one-off breakpoints (520, 500, 480, 820, 800).
- **Performance:** 29 MB in `academy/trainers/` (10.6 MB and 4.8 MB headshots displayed ~200 px tall; five 2–3 MB PNG/JPG heroes); no image compression, `loading="lazy"`, or `srcset`; render-blocking Google-Fonts CSS; Unsplash hot-links; GA on every Academy page; each page ships 200–300 lines of inline CSS that can't be cached.
- Console errors likely at runtime (by code reading): all four auth pages throw on load (`createClient` with placeholder URL); nothing else obvious. `<li>` in Academy nav (line 479) is left unclosed by the `<!-- </li> … -->` comment; `type="image/x-icon"` on a PNG favicon.

### 6.5 Duplication & inconsistency (parent vs Academy vs coming-soon)
- `assets/css/main.css` ≈ `academy/main.css` (1-line diff) → two sources of truth; tokens declared 4 times.
- Hero implemented three ways (parent light, Academy light, media dark).
- Nav differs: parent = icon + wordmark; Academy = image logo + "Gateway Ltd" pill; coming-soon = a third, wordmark-only nav (`.cs-nav`) that doesn't use the shared `nav#navbar` — although `main.css`'s bare `nav{}` and `footer{}` selectors still apply to them and are being overridden by `.cs-*` classes.
- Footer: parent 4-col; Academy 3-col with socials; coming-soon mini-footer.
- Buttons: `.btn-yellow` is used as the primary CTA on Academy but `.btn-primary` (red) on the parent; the Academy re-overrides `.btn-secondary` colours; `.btn-enrol`, `.pay-btn`, `.auth-btn`, `.cs-form-btn` are all separate button styles.
- FAQ, CTA banner, "parent link" pill each exist in 2–3 copies.
- Logo treatment: parent has no logo wordmark image; Academy has a raster PNG plus a separate inline SVG wordmark on the payment page.
- Phone/email/domain formats vary (`hello@gatewayltd.com`, `academy@thegatewayltd.com`, `academy@gatewayltd.com`; two different Google-Maps short links for the same address).

---

## Reference kit — what a new subsidiary should reuse or copy

**Copy / link as-is**
1. **`assets/css/main.css`** — tokens (`:root`), reset, `.container`, `.section-pad`, nav + hamburger + mobile menu, buttons (`.btn-primary`, `.btn-secondary`, `.btn-yellow`), `.ticker-*`, `.section-kicker`, `.reveal*`, `.info-strip`, footer, keyframes. *Use this file (not `academy/main.css`) as the master; if the subsidiary uses an image logo, add the `.logo-emblem{height:48px;width:auto}` line from `academy/main.css:33`.*
2. **Font tag** (identical on every page): Inter `wght@300;400;500;600;700;800&display=swap` + two `preconnect`s.
3. **Favicon** `assets/icon/icon (2).png` (or the subsidiary's own; add `apple-touch-icon`).
4. **Inline JS block** (cursor, navbar `.scrolled`, mobile menu, `IntersectionObserver` reveal, smooth-anchor) — from the bottom of `academy/index.html:951-1000` (cleanest version; includes hero-letter parallax).

**Copy the pattern from these files/lines**
| Need | Source |
|---|---|
| Light hero with image + gradient overlay | `academy/index.html:55-108` (or `index.html:16-50` for the richer parent version) |
| Nav with "Gateway Ltd" back-pill | `academy/index.html:28-31` (CSS), `:467-493` (HTML), `.footer-parent-link` `:400-402` |
| Kicker + H2 (`<em>` accent) section header | `.section-kicker` in `main.css`; headline styles `academy/index.html:119-127, 160-161` |
| Card grids (icon tile, hover bar, faint bg) | `.sub-card` `index.html:66-121`; `.prog-card`/`.prog-featured` `academy/index.html:165-244`; `.about-card`, `.trainer-card` |
| Dark feature section w/ photo bg | `.mission` (`index.html:126-140`) / `.facility` (`academy/index.html:249-306`) |
| CTA banner | `academy/index.html:358-383` |
| Pricing cards | `.bundle-card`, `.btn-enrol` (`media-production/index.html`) |
| FAQ accordion (use the accessible one) | `admissions.html` `.faq-question[aria-expanded]` (add JS to toggle it) |
| Stats row | `.hero-stats` |
| Academy-style footer with socials | `academy/index.html:388-402, 894-945` |
| Interim page while building | `.cs-*` template in `comms/index.html` (keeps the badge/headline/notify layout) |
| Checkout (only if payments needed) | `academy/auth/payment.html` + a server-side verify endpoint that doesn't exist yet |

**Design rules to preserve:** red `#E51524` = action/brand; yellow `#FFAB00` = highlight/ticker/secondary CTA; charcoal `#1A1714` + cream `#F8F6F2` alternate section backgrounds; Inter 800 headlines with one italic-300 accent word; 9–11 px uppercase tracked labels; 1 px borders, 2/4/6 px radii, no heavy shadows; 1280 px container, 100 px section padding; breakpoints 960/680.

**Assets to create per subsidiary (none exist):** logo (SVG preferred), favicon set, OG image (1200×630), real hero photo (compressed WebP/AVIF), accent colour decision, copy deck.

**Fix before cloning (to avoid multiplying defects):** move to absolute cross-site URLs; add `<meta description>`, OG/Twitter, canonical, JSON-LD; add `<main>` + skip link + `prefers-reduced-motion`; compress images; give subsidiaries their own favicon and GA/GSC.

---

## Do not touch — parent + Academy files

**Parent site**
- `index.html`
- `sitemap.xml`
- `assets/css/main.css`
- `assets/icon/icon (2).png` (favicon in use) — `assets/icon/icon.jpeg` is unused but harmless
- `assets/images/hero_banner.jpg`
- `assets/js/config.js`, `assets/js/payment.js` (shared by Academy auth; leave until the auth decision is made)
- Brand files at root: `Gateway Brand Colour.jpg`, `Gateway Brand Guide.pdf`, `gateway.jpeg`
- `.vscode/settings.json`

**Academy (everything under `academy/`)**
- `academy/index.html`, `academy/main.css`, `academy/sitemap.xml`, `academy/admissions.html`
- `academy/media-production/index.html` (and stray `academy/media-production/me`)
- `academy/auth/payment.html`, `academy/auth/auth.js`, `academy/auth/{login,signup,forgot-password,reset-password}.html`
- `academy/icon/*`, `academy/logo/*`, `academy/trainers/*`
- Duplicated shared assets that the Academy or history may rely on: `assets/logo/THE GATE WAY ACADEMNY LOGO-01.png`, `assets/images/academy_hero.png`

**Safe to edit for the new work:** only `comms/`, `studios/`, `spaces/`, `photography/` (currently the placeholder `index.html` in each), plus *new* files you add.

---

## Open questions (couldn't be answered from code)

1. **How is each site actually deployed?** Is there one Vercel project (root = repo) plus a second for `academy.thegatewayltd.com` (Root Directory `academy/`), or another arrangement? Which branch, and are there settings in the Vercel dashboard (domains, redirects, env vars) that aren't in the repo?
2. **Are `comms/studios/spaces/photography.thegatewayltd.com` DNS/Vercel domains already created**, or should each be a path under the parent? (Parent text uses `…gatewayltd.com` without "the" — typo or a second domain that you own?)
3. **Canonical host:** `www.thegatewayltd.com` or the apex? Should `thegatewayltd.com/academy/*` redirect to `academy.thegatewayltd.com`?
4. **Is Supabase auth intended to launch** (real URL/anon key exists somewhere) or should the auth pages and `admissions.html` be retired and removed from the sitemap?
5. **Payment operations:** where does Gateway see enrolments today (Paystack dashboard only?), who receives them, and is a webhook/verification planned?
6. **Official brand colours and typography:** the brand guide PDF could not be read here (no PDF tooling; installs were off-limits). Does it specify colours/fonts different from the CSS (`#E51524`, Inter)? The colour sheet's red swatch is labelled `ffab00` in error — what is the intended red hex?
7. **Which claims are true?** "Est. 2024" vs "10+ years", "1K+ clients", "10+ industry trainers", Spaces' "3 locations / 200+ desk seats / 24/7", "5 active subsidiaries".
8. **Subsidiary definitions:** final one-line descriptions, logos, and accent colours for Comms, Studios, Spaces and Photography; and whether Studios is the physical studio the Academy operates inside (the Academy FAQ says so).
9. **Is the Academy's July 2026 cohort closed?** Should the current pages show the next intake, "applications closed", or a waitlist?
10. **Who owns the partner logos** (Gates Foundation, Sightsavers, Mercy Corps, Sasakawa, UNHCR, UNDP) usage permission, and the Unsplash image licences?
11. **Is `academy/media-production/me` (older page copy) safe to delete?** And is `.vscode/settings.json` meant to be public?
12. **Which social/email identities are canonical** (`hello@` vs `academy@` on `thegatewayltd.com` or `gatewayltd.com`)?
13. **Analytics/Search Console:** is there a GA4/GSC property for the parent and for each future subsidiary?
