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

final result: passed
