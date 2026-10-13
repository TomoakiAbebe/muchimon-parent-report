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
