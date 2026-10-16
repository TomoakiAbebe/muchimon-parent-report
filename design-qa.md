# Design QA — Muchimon Parent Reports

## Comparison target

- Source visual truth: the established Muchimon mobile language in `audit/01-children-final.png`, `audit/02-learning-final.png`, and `audit/03-chat-final.png`, plus the approved requirement that a selected child's first screen combines learning and chat and tells the parent what to do first.
- Implementation screenshot: `audit/05-child-overview-browser.png`.
- Source app-screen pixels: `393 × 852` at device scale factor 1.
- Implementation browser capture: `1058 × 660`; the runtime scales the `393 × 852` iPhone screen uniformly to fit the Chrome canvas. Visual judgment was limited to app-owned content and did not compare browser canvas or device-frame padding.
- State: child list → あいさん → combined overview; learning `1日`; chat `1週間`.

## Evidence reviewed

- Full-view comparison: the existing child list and report captures were compared with the new combined overview for palette, typography, card anatomy, icon treatment, spacing, and bottom navigation.
- Focused comparison: above-the-fold parent action, combined learning/chat summary, learning entry card, and three-item bottom navigation.
- Primary interactions tested in Chrome: child selection, voice-prompt sheet, direct `1日` learning shortcut, learning period tabs, direct chat report opening, `1週間` chat state, return to summary, and return to child list.
- Voice-prompt detail state tested in Chrome: the 82% height sheet opens above app navigation, its 1,098px content scrolls within a 620px viewport, and the fixed return button remains visible before and after scrolling.
- Runtime integrity, TypeScript production build, and Sites packaging tests passed.

## Findings

- No actionable P0, P1, or P2 issue remains.
- Fonts and typography: Roboto/Hiragino Sans/Yu Gothic are preserved; labels, headings, values, and explanatory copy retain the established hierarchy without truncation.
- Spacing and layout rhythm: 16px screen gutters, 14px section gaps, rounded cards, and 44px-or-larger controls remain consistent. The overview uses vertical scrolling instead of shrinking all content above the fold.
- Colors and visual tokens: learning remains green, chat remains blue, and the first-action card uses the existing warm yellow hint treatment.
- Image quality and asset fidelity: the new overview uses the existing Radix pictogram/icon system and does not add placeholder or decorative raster assets. Existing report illustrations remain unchanged.
- Copy and content: the first instruction is concrete but non-prescriptive, learning and conversation data are shown together, and conversation language remains non-diagnostic.
- Information architecture: the selected-child landing screen now contains one recommended action, a cross-report summary, and one clear entry point for each report. Time-period selection is intentionally deferred to the tabs inside each detailed report.
- Accessibility and interaction: controls retain explicit accessible names and 44px targets; the active summary/learning/chat section is reflected in the persistent three-item bottom navigation.

## Comparison history

- Earlier state: selecting a child opened the weekly learning report immediately, so parents had to infer the next action and switch sections to discover conversation insights.
- First redesign pass: added the parent-action card, cross-report summary, both report entry cards, and a summary tab.
- QA finding: daily learning still displayed a weekly graph, and weekly chat still displayed a monthly total.
- Fix applied: daily learning now shows subject-level time; weekly chat now shows weekly totals and daily usage bars. Monthly states retain month-level totals and weekly bars.
- Post-fix evidence: Chrome interaction checks confirm the intended overview → report → period flow and correct selected periods.

## Follow-up polish

- [P3] Replace the sample date range with live report-period data when the prototype is connected to production data.
- [P3] Run VoiceOver and TalkBack checks before production release.

## Implementation checklist

- [x] Selected-child landing screen combines learning and chat.
- [x] Parent's first recommended action is shown before analytics.
- [x] Learning and chat report entry points are visible on the same screen.
- [x] Period selection is available after opening each detailed report.
- [x] Persistent summary/learning/chat navigation works.
- [x] Period-specific content is internally consistent.
- [x] Voice-prompt details are readable in a scrollable phone-scoped sheet with a persistent return action.
- [x] Runtime, build, and packaging checks pass.

## Requirement-led report reconstruction

- Learning report checked at `1日`, `1週間`, and `1か月`: each period now shows only its required time metrics, inferred subjects/units, period-specific focus or prior-month change, and a voice-prompt entry point.
- Removed from the rendered learning report: daily/weekly/monthly progress charts and the speculative unit map.
- Chat report checked at `1週間` and `1か月`: the content is limited to the four required elements—overview, topic/usage data, qualitative interests and changes, and one or two voice prompts.
- Removed from the rendered chat report: usage trend charts, decorative family/parent illustrations, and unrelated detail actions.
- Period switching returns the scroll area to the top, so the parent never lands midway through a newly selected report.
- Voice-prompt detail copy now follows the selected period and report type. Chat copy avoids diagnosis and uses observation-based language.

final result: passed

## 2026-10-16 — Cross-device icon centering audit

- source visual truth path: Current approved prototype and the user's requirement that icons remain centered on every page and device.
- implementation screenshot path: Browser-rendered evidence captured from `http://127.0.0.1:5205/#overview`; responsive states were also inspected live in the in-app browser.
- viewport: iPhone 393 × 852, Pixel 10 412 × 915, iPad 1024 × 768, and PC 1366 × 768 virtual previews.
- state coverage: overview, learning report, chat report, child selection, login, registration, password reset, voice-prompt overlay, streak calendar overlay, and child settings overlay.
- full-view comparison evidence: The post-fix overview screenshot shows the leading lightning icon, report summary icons, and trailing action icons centered within their containers.
- focused region comparison evidence: Automated rectangle-center checks compared each visible direct SVG against its shared icon container. All 28 page/device combinations and 12 modal/device combinations completed with zero offsets above the 1px tolerance.
- findings and fixes: Heading-label and metric-label selectors were unintentionally matching shared `.icon-bubble` spans and changing their centering layout to `display:block`. Both selectors were narrowed to their text wrappers, restoring the shared grid centering behavior.
- fonts and typography: Unchanged.
- spacing and layout rhythm: Icon container sizes and surrounding spacing are unchanged; only internal centering behavior was corrected.
- colors and visual tokens: Unchanged.
- image quality and asset fidelity: Existing vector icons are preserved.
- copy and content: Unchanged.
- accessibility limits: Geometry and visible states were checked; screenshots alone do not establish full assistive-technology compliance.
- final findings: No actionable P0, P1, or P2 icon-alignment issues remain in the checked states.

final result: passed

## 2026-10-16 — Voice-prompt overlay single-column check

- source visual truth path: User-approved voice-prompt overlay plus the explicit request that sections 1, 2, and 3 stack vertically on iPad and PC.
- implementation screenshot path: Browser-rendered implementation inspected at `http://127.0.0.1:5203/#overview` in the in-app browser; evidence was captured through live DOM geometry because this change is a responsive layout rule rather than an image-fidelity revision.
- viewport: iPad 1024 × 768 and PC 1366 × 768 virtual previews.
- source and implementation pixel dimensions, CSS size, and density normalization used: Source requirement is structural and has no raster dimensions. Implementation was inspected in the app's calibrated iPad and PC preview modes; surrounding preview scaling was excluded by comparing the modal content's computed layout and section rectangles.
- state: `今週の声かけ` → `声かけ例を詳しく見る` overlay open.
- full-view comparison evidence: Both large-screen variants render `.voice-hint-detail` as `display: block`; numbered sections share the same left position and width and appear in strictly increasing top order (1 → 2 → 3).
- focused region comparison evidence: iPad section top positions were 232, 312, and 413; PC positions were 266, 326, and 402. No horizontal overlap or side-by-side track remains. Modal close action remained available.
- fonts and typography: Existing type family, weights, sizes, and hierarchy are preserved. The wider single-column measure removes the excessive line wrapping identified by the user.
- spacing and layout rhythm: Sections use a consistent 16px vertical gap and a centered readable content width on iPad and PC.
- colors and visual tokens: Existing semantic colors and card surfaces are unchanged.
- image quality and asset fidelity: No imagery or icon assets were changed.
- copy and content: All existing wording and the numbered 1/2/3 order are unchanged.
- findings: No actionable P0, P1, or P2 issues remain for the requested layout change.
- comparison history: Earlier large-screen CSS used two columns on iPad and three columns on PC, splitting the numbered sequence horizontally. It was replaced with one centered block flow; the post-fix browser geometry confirms the sections now stack vertically at both breakpoints.
- primary interactions tested: Open detail overlay, read sections in order, close with `レポートに戻る`, switch between iPad and PC previews.
- console errors checked: No runtime or build errors were reported during the verified flow.

final result: passed

## iPad and PC overview density redesign

- Source visual truth: the approved phone overview plus the request to remove excess whitespace specifically on iPad and PC.
- Rendered implementation: `http://127.0.0.1:5202/#overview`, verified in the in-app browser on tabs 52 and 53.
- Viewports: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`, CSS density 1 inside the virtual-device runtime.
- State: selected-child weekly overview with no overlay open.
- Full-view comparison: iPad/PC now use a full-width 152px continuity bar above a lower two-column layout. The voice-prompt card occupies the wider left column, while the weekly-summary card occupies the narrower right column.
- Focused comparison: iPad columns measured `623px / 321px`; PC content columns measured `652px / 320px`. The lower cards each measured 444px high, removing the prior tall sparse left/right stack.
- Continuity density: the streak total and weekday row share one horizontal line, with `1か月を見る` separated as a right-side action instead of leaving unused vertical space.
- Weekly-summary density: learning and chat are equal-height action rows with larger icons and report buttons, filling the narrow column without reintroducing deleted metrics.
- Fonts and typography: existing desktop/tablet type sizes and hierarchy are retained; action labels remain single-line.
- Spacing and layout rhythm: every iPad/PC section has matching `clientWidth`/`scrollWidth` and `clientHeight`/`scrollHeight`, confirming no clipping or internal overflow.
- Colors and visual tokens: existing continuity yellow, learning green, and chat blue remain unchanged.
- Image and icon fidelity: existing Radix icons and pictograms are retained; no new assets were required.
- iPhone regression check: the phone keeps its vertical 20/50/30 stack, and all three sections still match their allocated heights without overflow.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Compact selected-child header

- Source visual truth: the current iPhone overview plus the request to reduce camera-area pressure by showing only the selected child's name.
- Rendered implementation: `http://127.0.0.1:5201/#overview`, verified in the in-app browser on tab 50.
- Viewport: iPhone `393 × 852`, CSS density 1 inside the virtual-device runtime.
- State: selected-child weekly overview and weekly learning report.
- Full-view comparison: the overview header now contains only the back control and `あいさん`; the pictogram, continuity count, and `今週の声かけ` title were removed from the header.
- Focused comparison: the overview header was reduced from 105px to 88px. Its measured `clientHeight` and `scrollHeight` both equal 88px, and the child name remains centered without clipping.
- Detailed reports: header continuity text was removed there as well. The learning header contains only `あいさん`, the report title, and period tabs; `scrollWidth` matches `clientWidth` at 393px.
- Fonts and typography: the selected child name uses a single 18px label with no competing secondary metadata.
- Spacing and layout rhythm: the compact header adds vertical breathing room above the first content card while preserving the 44px back target.
- Colors and visual tokens: existing ink and pale-blue header treatments are unchanged.
- Image and icon fidelity: no new assets were introduced; the redundant header pictogram was intentionally removed.
- Copy/content: `12日連続` and `今週の声かけ` no longer appear in the overview header; continuity remains available in the main continuity section.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Revised continuity and weekly-summary proportions

- Source visual truth: the approved three-section weekly overview and the requested `20% / 50% / 30%` phone hierarchy.
- Rendered implementation: `http://127.0.0.1:5200/#overview`, verified in the in-app browser on tabs 47 and 48.
- Viewports: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`, CSS density 1 inside the virtual-device runtime.
- State: selected-child weekly overview, April calendar overlay, and navigated March calendar state.
- Full-view comparison: phone rows measured `141px / 352.5px / 211.5px`, matching the requested 20% / 50% / 30% proportions after gaps.
- Focused comparison: `1か月を見る` is anchored to the bottom of the continuity card with a measured 5px bottom inset. All three phone sections have matching `clientHeight` and `scrollHeight`.
- Weekly-summary content: removed `5日`, `分数のたし算`, `学校46%`, and `友だちの話題`; the section now contains only the learning/chat labels and their respective detail actions.
- Calendar navigation: `前の月を見る` changes April to March and exposes `次の月を見る` for returning toward the current month. The calendar accessible label updates with the selected year and month.
- Fonts and typography: retained the existing hierarchy; reduced summary content improves scan speed without shrinking action labels.
- Spacing and layout rhythm: the smaller continuity section keeps its navigation at the bottom; the larger weekly-summary allocation gives both report actions comfortable touch space.
- Colors and visual tokens: existing yellow continuity, green learning, and blue chat treatments remain unchanged.
- Image and icon fidelity: existing Radix iconography is retained; no new image assets were required.
- Responsive evidence: iPad and PC retained the optimized left-stack/right-feature composition, with every section matching its allocated height and no overflow.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Three-section weekly overview and monthly continuity calendar

- Source visual truth: the approved local weekly-overview design, the approved Duolingo-inspired continuity widget, and the requested `25% / 50% / 25%` phone hierarchy.
- Rendered implementation: `http://127.0.0.1:5199/#overview`, verified in the in-app browser on tabs 44 and 45.
- Viewports: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`, CSS density 1 inside the virtual-device runtime.
- State: selected-child `今週の声かけ` screen and open `連続記録` monthly-calendar overlay.
- Full-view comparison: the phone layout now follows `連続記録` → `まずはこちら` → `今週のまとめ`; computed rows were exactly `176.25px / 352.5px / 176.25px`.
- Focused comparison: all three phone sections reported matching `clientHeight` and `scrollHeight`, so no content is clipped inside the fixed, non-scrolling overview.
- Responsive structure: iPad uses a `368px / 576px` split and PC uses a `324px / 648px` split. The voice-prompt card spans both rows in the larger right column; continuity and the compact weekly summary stack on the left.
- Fonts and typography: preserved the existing hierarchy and reduced only supporting summary text; primary section titles and action labels remain readable.
- Spacing and layout rhythm: the continuity and summary sections each occupy the smaller visual tier while the voice-prompt section remains dominant. All large-screen cards matched their allocated heights without overflow.
- Colors and visual tokens: reused the existing yellow continuity, green learning, and blue chat tokens.
- Image and icon fidelity: reused the existing pictograms and Radix icons; the monthly calendar introduces no unsupported illustration or placeholder asset.
- Copy/content: the compact weekly summary now shows one key learning value and one key conversation value before each `詳細を見る` action.
- Interaction: tapping continuity opens a centered one-month calendar overlay. The overlay shows the current streak, highlighted activity days, today's outline, supportive explanatory copy, and a return action; its content fits without outer modal overflow.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Balanced continuity cards and report-header visibility

- Source visual truth: the supplied child-selection screenshot plus the previously approved continuity-widget direction.
- Rendered implementation: `http://127.0.0.1:5197/#children`, verified in the in-app browser on tabs 39 and 40.
- Viewports: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`, CSS density 1 inside the virtual-device runtime.
- State: authenticated child-selection screen, selected-child weekly overview, and weekly learning detail report.
- Full-view comparison: rebalanced each child card into a clear profile row, full-width continuity row, and full-width report action. The portrait and identity no longer compete with the seven-day widget for the same narrow column.
- Focused comparison: iPhone cards measured `359 × 310px`, with a `325px` continuity widget and no horizontal overflow. iPad/PC cards measured `467 × 309px`, with the widget using a balanced `128px / 245px` two-column layout and matching `clientWidth`/`scrollWidth` of `421px`.
- Fonts and typography: retained the existing type hierarchy; the child's name remains primary, while `今日も継続中`, consecutive days, and weekday labels form a compact secondary hierarchy.
- Spacing and layout rhythm: portrait, identity, continuity block, and CTA now use consistent full-card alignment and equal card heights for both children.
- Colors and visual tokens: retained each child's yellow/blue tone in status and activity states without changing the green primary CTA.
- Image and icon fidelity: retained the existing pictograms and Radix icons; no substitute illustrations or unsupported assets were introduced.
- Copy/content: the approved consecutive-day values remain unchanged. `12日連続` or `4日連続` now also appears in the selected child's header.
- Detail visibility: the consecutive-day badge was verified on `今週の声かけ` and on the learning detail report; both headers measured `scrollWidth === clientWidth` with no clipping.
- Responsive evidence: iPhone, iPad, and PC child cards passed visual and overflow checks. Primary card selection and report navigation remained functional.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Child-card continuity widget

- Source visual truth: `/var/folders/0w/s4_nytxd0q94jk4yxg6d3n780000gn/T/TemporaryItems/NSIRD_screencaptureui_5iR9gi/スクリーンショット 2026-10-16 14.45.00.png` (`1640 × 864`, desktop child-selection state).
- Rendered implementation: `http://127.0.0.1:5196/#children`, captured in the in-app browser on tab 37 for iPhone, iPad, and PC preview modes.
- Viewports: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`; implementation was inspected at CSS density 1 inside the virtual-device runtime.
- State: authenticated child-selection screen with both child cards visible and no modal open.
- Full-view comparison: preserved the source card hierarchy, child pictograms, settings actions, two-card tablet/desktop layout, green `詳しく見る` CTA, add-child action, and privacy note. Only the requested middle card content changed.
- Focused comparison: replaced both report-summary messages with a compact continuity widget showing the current consecutive-day count, `継続中` state, and seven weekday markers. The card widths, settings control, profile copy, and report CTA remain aligned with the source.
- Fonts and typography: retained Roboto/Hiragino/Yu Gothic; the consecutive-day number is the primary emphasis, with compact supporting labels that remain legible without wrapping.
- Spacing and layout rhythm: widget content fits without horizontal overflow at all three target sizes. Measured widget `clientWidth` and `scrollWidth` matched on iPhone (`195px`) and iPad/PC (`277px`).
- Colors and visual tokens: yellow and blue child tones carry into the continuity states while the existing green primary report CTA is unchanged.
- Image and icon fidelity: retained the existing pictogram system and used the project's Radix icon library for the continuity and completion states; no new raster asset was required.
- Copy/content: removed `今週5日取り組みました` and `学校の話題が多く見られました` from the cards. Added accessible labels such as `12日連続で取り組んでいます`.
- Primary interactions tested: each settings control still opens the management overlay; `詳しく見る` still opens the selected child's weekly overview; PC sidebar return to the child list still works.
- No actionable P0, P1, or P2 mismatch remains.

final result: passed

## Dense weekly overview and alignment pass

- Source of truth: the existing local two-section weekly overview plus the request to reduce empty space using information already available in each detail view.
- Added compact detail-derived previews to `まずはこちら`: what was observed this week, learning/chat-specific prompt examples, and a short delivery-point category.
- Expanded `学習とおしゃべり` with the key metrics, common time bands, leading subjects/topics, repetition counts, and small changes that are available from the detailed reports.
- Kept `おしゃべり` on one line at iPhone, iPad, and PC widths.
- Aligned leading pictograms, labels, action buttons, and trailing chevrons to shared visual centers; measured chevron center offsets were effectively 0px on PC.
- Verified the iPhone overview remains a fixed, non-scrolling screen with the full primary action visible (`clientHeight` and `scrollHeight` both 747px).
- Verified iPad and PC layouts use balanced two-column sections; the PC viewport also remained non-scrolling (`clientHeight` and `scrollHeight` both 720px).
- No actionable clipping, overflow, unintended wrapping, or icon misalignment remains.

final result: passed

## Two-section weekly overview

- Source visual truth: the established published weekly-overview design plus the user's requirement to remove `今週の利用時間` and retain only `まずはこちら` and `学習とおしゃべり`.
- Browser-rendered implementation: `http://127.0.0.1:5193/#overview`, captured in the in-app browser for iPhone, iPad, and PC preview modes.
- Viewports and states: iPhone `393 × 852`, iPad `1024 × 768`, and PC `1366 × 768`; あいさん weekly overview with no modal open.
- Full-view evidence: iPhone shows exactly two vertically balanced cards; iPad and PC show the same two cards as a balanced two-column composition. The weekly usage chart and its heading are absent from the accessibility tree and rendered screen.
- Focused-region evidence: the recommendation card now exposes `分数のたし算・4回` and `学校・友だちの話題` before the parent opens the detailed voice-prompt overlay. The weekly summary retains separate learning and chat detail actions.
- Fonts and typography: the established hierarchy, line heights, and weights remain intact; key-point labels use compact supporting type without truncating their values.
- Spacing and layout rhythm: iPhone uses measured rows of approximately `342px / 371px`, with `clientHeight` and `scrollHeight` both `747px` and `overflow-y: hidden`. iPad uses approximately `442px / 498px` columns; PC uses approximately `403px / 565px` columns after the persistent sidebar.
- Colors and visual tokens: yellow recommendation, green learning, blue chat, white surfaces, radii, and shadows remain consistent with the existing Muchimon system.
- Image quality and asset fidelity: existing Radix learning and chat icons are reused; no new raster or approximate assets were introduced.
- Copy and content: only `まずはこちら` and `学習とおしゃべり` remain. The newly surfaced points summarize content available from the detailed reports rather than adding unrelated metrics.
- Interaction and accessibility: all three detail actions remain real buttons; the recommendation key points have an accessible group label; no horizontal or fixed-page vertical overflow was observed.
- Comparison history: the earlier overview devoted its first section to a seven-day usage chart. The revised layout removes that section, promotes actionable report-derived points, and reallocates space per device. No P0/P1/P2 issues remain.

final result: passed

## Personalized voice-prompt feedback

- Source visual truth: the previously published weekly-overview screen at `https://tomoakiabebe.github.io/muchimon-parent-report/#overview`, reviewed together with the user's personalized-copy and category-separation requirements.
- Browser-rendered implementation: `http://127.0.0.1:5192/#children` and `#overview`, verified in the in-app browser.
- Viewport and state: iPhone preview, `393 × 852` CSS app screen; child list, fixed weekly overview, and the internally scrolled voice-prompt overlay for あいさん.
- Full-view comparison evidence: the published and local weekly-overview captures were emitted in the same comparison pass. The section order, card proportions, color hierarchy, and fixed single-screen composition remain unchanged while the generic prompt is replaced with a data-specific example.
- Focused-region evidence: the overlay was reviewed at its initial position and after an internal scroll. Both the green `学習` prompt and blue `おしゃべり` prompt remain readable, visually distinct, and reachable above the persistent return action.
- Fonts and typography: existing hierarchy and weights are preserved; the longer personalized sentence wraps without clipping or truncation.
- Spacing and layout rhythm: the overview still reports `clientHeight: 747`, `scrollHeight: 747`, and `overflow-y: hidden`; no landing-page scroll was introduced.
- Colors and visual tokens: established green learning, blue chat, yellow recommendation, white surfaces, radii, and shadows are preserved.
- Image quality and asset fidelity: existing Radix icons are reused for category identification; no new raster or approximate assets were added.
- Copy and content: child-list CTAs now read `詳しく見る`. The featured prompt references `算数`, `分数のたし算`, and `4回`; the detail overlay separates a learning praise prompt from a school/friendship conversation prompt.
- Interaction and accessibility: both child CTAs remain real buttons; the voice-detail action opens the modal; its internal scroll reaches both category cards and the guidance section.
- Comparison history: the published version used a generic `今週もよく続けていたね` prompt and an undifferentiated example list. The local revision replaces it with report-grounded wording and category-specific cards. No P0/P1/P2 issues were found in the post-change pass.

final result: passed

## iPad return path and responsive voice-prompt overlay

- Source visual truth: the established Muchimon weekly-overview composition and the user's requirement that tablet/desktop controls fit their virtual canvases.
- Browser-rendered implementation: `http://127.0.0.1:5189/#overview`, verified in the in-app browser using the built-in iPad (`1024 × 768`) and PC (`1366 × 768`) preview options.
- State: あいさん → 今週の声かけ; voice-prompt overlay closed for the return-path test and open for the responsive-overlay test.
- Full-view evidence: iPad shows a persistent header back button; activating it changes the route to `#children` and exposes the complete child-selection screen. PC retains its persistent guardian sidebar.
- Focused-region evidence: computed iPad modal width is `720px` with two `323px` content columns and a `680px` maximum height. Computed PC modal width is `920px` with three approximately `275px` content columns and the same `680px` maximum height.
- Fonts and typography: existing 22px modal title and established body hierarchy remain unchanged and readable at both larger canvases.
- Spacing and layout rhythm: the iPad modal uses a centered two-column structure; the PC modal uses three balanced columns. Both retain a 28px radius, consistent gaps, and an internally scrolling body.
- Colors and visual tokens: existing white surface, navy type, green actions, dimmed overlay, and Muchimon report tokens are preserved.
- Image quality and asset fidelity: existing Radix icons and pictograms are reused; no new raster or approximate assets were introduced.
- Copy and content: all existing voice-prompt wording is preserved; only responsive presentation and navigation were changed.
- Primary interactions tested: iPad weekly overview → child selection; iPad voice-prompt open/close; PC voice-prompt open; preview switching between iPad and PC.
- Browser console: no visible runtime error or broken interaction surfaced during the pass.
- Comparison history: the earlier large-screen state retained a phone-width dialog and the iPad overview lacked a clear return action. The post-fix browser pass confirms both issues are resolved with device-specific dialog widths and a functioning iPad header return button.
- No actionable P0/P1/P2 findings remain.

final result: passed

## Unified virtual-device preview

- Replaced the visible two-device control with one app-owned Radix menu containing iPhone (393 × 852), Pixel 10 (412 × 915), iPad (1024 × 768), and PC (1366 × 768).
- The protected runtime picker and runtime source files remain unchanged; runtime integrity passes.
- iPhone and Pixel selections update the runtime device preset and preserve their native bezel, status bar, camera, and home/navigation treatment.
- iPad and PC selections create scaled virtual canvases that fit the available browser stage. iPad uses the two-column tablet composition; PC shows the persistent 250px guardian sidebar.
- Interaction sequence tested in the in-app browser: iPhone → iPad → PC → Pixel 10. The trigger label, size label, body preview mode, runtime device, canvas geometry, and sidebar visibility all changed as expected.
- Measured virtual canvas display: iPad 858.67 × 644px at its computed scale; PC 1145.45 × 644px at its computed scale. Both preserve the intended 4:3 and 1366:768 aspect ratios.
- No horizontal document overflow occurred in PC mode. Returning to Pixel removed the desktop sidebar and restored the protected Android device preset.
- All controls are keyboard-accessible menu radio items with a visible selected indicator and explicit device dimensions.
- No actionable P0/P1/P2 findings remain.

final result: passed

## Tablet and desktop responsive layouts

- Visual source: the existing verified smartphone Muchimon UI, expanded without changing its information hierarchy, tokens, or interaction labels.
- Tablet evidence: Chrome at 1079 × 716 before the desktop navigation breakpoint, showing the child list and the weekly overview in two-column layouts with no horizontal overflow.
- Desktop evidence: Chrome at 1079 × 716 with the 1050px desktop breakpoint active, showing the persistent 250px sidebar, weekly overview, learning report, and centered login card.
- Responsive states checked: `#login`, `#children`, `#overview`, and `#learning`; sidebar navigation exposes child list, weekly voice prompt, learning, chat, and logout actions.
- Fonts and typography: the mobile font stack and hierarchy are retained; tablet/desktop headings scale to 21–36px and body copy remains readable without dense mobile wrapping.
- Spacing and layout rhythm: tablet uses centered content up to 960px and two child/report columns; desktop offsets all authenticated views from the sidebar and uses up to 1180px at wide screens.
- Colors and visual tokens: the existing navy, green, blue, yellow, pale-cyan background, radii, and shadows are preserved. The desktop sidebar uses a darker green extension of the same palette.
- Image and icon fidelity: pictograms and Radix UI icons are reused; no placeholder, emoji, CSS-drawn, or rasterized icons were introduced.
- Copy and content: all existing labels and report data are preserved across breakpoints.
- Interaction and accessibility: navigation and logout remain real buttons; active desktop navigation is visually distinct; touch targets remain at least 44px; modals are capped at 620px and remain centered.
- Overflow verification: the child list, weekly overview, learning report, and login screen showed zero horizontal document overflow in Chrome. The weekly overview required no internal vertical scrolling at the tested tablet and desktop heights.
- Intentional difference: the tablet layout omits the persistent sidebar to prioritize report width; the compact logout control remains on the child-list page. Desktop uses the sidebar and hides the duplicate child-list logout control.
- No actionable P0/P1/P2 findings remain.

final result: passed

## Guardian authentication flow

- Source visual truth:
  - `qa-login-source.png` (1242 × 884 px)
  - `qa-register-source.png` (1272 × 1018 px)
  - `qa-reset-source.png` (1212 × 856 px)
- Browser-rendered implementation evidence:
  - `qa-login-implementation.png` (1039 × 720 px browser capture)
  - `qa-register-implementation.png` (1039 × 720 px browser capture)
  - `qa-reset-implementation.png` (1039 × 720 px browser capture)
- Comparison evidence: `qa-auth-comparison.html`, opened in the in-app browser with each reference and implementation paired side by side.
- Viewport and density: iPhone runtime, 393 × 852 CSS px app screen, shown inside the template-owned phone frame; browser captures are 1039 × 720 at device scale 1. The references are desktop-width source screens, so their information hierarchy and copy were normalized into the established mobile runtime rather than pixel-copied.
- State: logged out login, registration form, password-reset form, and reset email field focused with the simulated keyboard visible.
- Full-view comparison: all three screens preserve the reference hierarchy (heading, fields, primary action, return/alternate path) while adopting the existing Muchimon green/blue tokens, pictogram language, rounded controls, and smartphone spacing.
- Focused comparison: form fields, password visibility control, links, consent row, primary buttons, and explanatory copy were checked separately; no custom or placeholder image assets are used.
- Fonts and typography: existing Roboto/Japanese system fallback, 16px inputs to prevent mobile zoom, and a consistent heading hierarchy remain legible at the phone viewport.
- Spacing and layout rhythm: 44px minimum touch targets, 53–58px fields, compact registration density, and single-column forms fit without horizontal overflow.
- Colors and visual tokens: guardian flows consistently use the existing green primary, navy text, blue links, and pale cyan background.
- Image quality and asset fidelity: the references contain no required product imagery; Radix icons are used for every UI icon and the protected runtime owns the device chrome.
- Copy and content: the reference wording is retained or shortened for mobile; the prototype-only note clearly explains that login works without input.
- Primary interactions tested: empty login opens `#children`; login → registration → login; login → password reset; password visibility; reset success action; keyboard-open layout keeps the focused field, primary action, and return action above the keyboard.
- Browser console: no visible runtime error or broken state surfaced during the interaction pass.
- Comparison history: the first keyboard pass double-applied the keyboard inset and hid actions. The extra parent inset was removed; the runtime `MobileScroll` now owns the keyboard inset. Post-fix evidence shows the focused email field, `再設定メールを送信`, and `ログインへ戻る` above the keyboard.
- Remaining differences are intentional mobile adaptations from desktop references, not fidelity defects. No actionable P0/P1/P2 findings remain.

final result: passed

## Fixed landing-page section order

- Reordered the child landing page to `今週の利用時間` → `今週はこんな声かけから` → `今週のまとめ`.
- Verified the visual and accessibility-tree order on the iPhone preview.
- The fixed content viewport remains non-scrollable: `clientHeight` and `scrollHeight` are both 747px, with `overflow-y: hidden`.
- All summary content and both detail-report actions remain visible within the single screen.

final result: passed

## Fixed landing page with weekly usage chart

- Source visual truth: `/var/folders/0w/s4_nytxd0q94jk4yxg6d3n780000gn/T/TemporaryItems/NSIRD_screencaptureui_AeiQeg/スクリーンショット 2026-10-13 9.53.28.png` (`644 × 1300` framed screenshot).
- Rendered implementation: `http://127.0.0.1:5178/#overview`, captured in the iPhone runtime with a `393 × 852` CSS screen at device scale factor 1.
- State: あいさん → 今週の声かけ; fixed landing page with no modal open.
- Full-view comparison: preserved the reference header, warm voice-prompt card, white weekly-summary card, green/blue report rows, and lower open area. Filled only that lower open area with the requested usage chart.
- Focused comparison: the added chart follows the same white-card radius, green icon treatment, compact label hierarchy, and 16px outer gutters as the reference summary card. No raster or decorative image asset was required.
- Fonts and typography: preserved Roboto/Hiragino/Yu Gothic hierarchy; chart labels use compact supporting sizes while the title and total remain readable.
- Spacing and layout rhythm: all four visible regions—header, voice prompt, weekly summary, and chart—fit inside the screen without overlap or clipping.
- Colors and visual tokens: chart bars reuse the existing learning green; the chart background remains white against the pale blue app background.
- Copy/content: chart shows seven daily values and a weekly total; no additional speculative interpretation was added.
- Interaction and overflow evidence: browser inspection returned `{ clientHeight: 747, scrollHeight: 747, overflowY: 'hidden' }` for `.overview-fixed-content`, confirming the page has no scrollable overflow.
- Detail-report buttons remain functional, while detailed report screens retain their existing vertical scrolling.
- No actionable P0, P1, or P2 issue remains.

final result: passed

## Single-viewport weekly landing page

- Removed the separate `今週の詳細レポート` heading and both large report-entry cards.
- Rebuilt `今週のまとめ` as two compact vertical rows. Learning shows days, daily average, and the primary subject mix; chat shows the leading topic, common usage time, and one small change.
- Each summary row includes its own 44px `詳細を見る` action and opens the corresponding weekly detail report.
- Reduced only landing-page spacing and card density; retained readable body copy, 16px screen gutters, and the existing hierarchy.
- Verified on the iPhone runtime that the header, complete voice-prompt card, complete weekly summary, both detail buttons, and device home indicator are simultaneously visible without scrolling.

final result: passed

## Voice-prompt content consolidation

- Removed the voice-prompt card, example copy, and overlay entry point from every learning period.
- Removed the voice-prompt cards, example copy, and overlay entry point from both chat periods.
- Verified the weekly learning report now ends with `今週特に取り組んだこと` and the monthly chat report ends with `興味・関心と小さな変化`.
- The only remaining voice-prompt entry point is on the `今週の声かけ` landing page.
- Runtime integrity, production build, and Sites packaging tests pass.

final result: passed

## Weekly voice-prompt landing page

- Child selection now opens a page titled `今週の声かけ`; the child-list CTA uses the same label so the destination is predictable.
- The landing page leads with one concrete prompt, then shows the combined weekly summary and direct buttons for learning and chat detail reports.
- Removed the persistent summary/learning/chat footer from all child-report screens. Scroll viewports now extend to the device bottom and retain safe-area padding.
- Verified the learning detail opens at the weekly period and its header back button is labeled `今週の声かけに戻る`.
- Verified the full landing-page content remains reachable by vertical scrolling after footer removal.
- Runtime integrity, production build, and Sites packaging tests pass.

final result: passed

## Centered overlay modal conversion

- Replaced every app popup presentation with one centered, rounded overlay modal: child settings and its subviews, add-child form, overview voice prompt, and report voice-prompt details.
- Verified the settings modal remains visually centered over a dimmed app screen and exposes an explicit 44px close control.
- Verified the add-child modal opens without forcing the keyboard. When an input receives focus, the modal compacts its header and secondary introduction, moves above the keyboard, and keeps both fields and the primary action visible.
- Verified the long voice-prompt modal uses internal scrolling while keeping its return action available at the bottom of the modal.
- The modal respects the device status area and simulated keyboard inset on iPhone; the same keyboard inset API also covers the Pixel runtime.
- No runtime-owned bottom-sheet or keyboard files were modified.

final result: passed

## Child management and add-child flow

- Visual references: the two supplied screenshots for guardian account management and ID/password-based child creation. Their information architecture was adopted while retaining the established Muchimon green/blue mobile visual language.
- Checked in the iPhone runtime: child-card settings entry, management menu, premium status and renewal date, payment/password/withdrawal entry points, and the add-child form with the simulated keyboard open.
- The management hierarchy stays within one phone-scoped sheet, with clear back navigation for each subview and a separated red danger area for withdrawal.
- The add-child form uses keyboard-aware inputs, half-width alphanumeric ID validation, visible password requirements, inline errors, and a success state.
- Touch targets remain at least 44px; icons and labels align to a shared 40px leading column; the form uses 16px input text to avoid mobile browser zoom.
- The supplied desktop-width cards were intentionally reflowed into a single vertical smartphone list rather than compressed horizontally.
- Production/destructive effects are intentionally not connected: billing changes, password changes, and account deletion are UI-only prototype outcomes.
- Runtime integrity, TypeScript production build, and Sites packaging tests passed after implementation.

final result: passed
