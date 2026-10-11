# Design QA — Muchimon Parent Reports

## Comparison target

- Source visual truth: `public/assets/reference/learning-reference.png` and `public/assets/reference/chat-reference.png`
- Implementation: `http://127.0.0.1:4175/#learning` and `http://127.0.0.1:4175/#chat`
- Combined comparison artifact: `public/qa.html` (captured in Chrome at `http://127.0.0.1:4176/qa.html`)
- Source pixels: learning `942 × 1536`; chat `942 × 1536`
- Implementation viewport: iPhone app screen `393 × 852` CSS px, device scale factor 1 during the 1:1 checks
- State: learning / 1週間; chat / 1か月 and 1週間; detail bottom sheet open

## Evidence reviewed

- Full-view comparison: both references and both live implementation states were placed side-by-side on the QA board and captured together in Chrome.
- Focused comparison: each implementation was separately captured at an unscaled `393 × 852` phone-screen viewport to inspect typography, metric cards, charts, generated illustrations, segmented controls, and bottom navigation.
- Primary interactions tested: learning ↔ おしゃべり navigation, all visible period tabs, “詳しく見る”, and the detail sheet.
- Console errors checked: no warnings or errors.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: hierarchy, optical weight, wrapping, and muted secondary copy follow the source. Roboto plus Japanese system fallbacks preserves legibility at the smaller runtime viewport.
- Spacing and layout rhythm: section order, rounded-card cadence, metric density, chart proportions, and persistent bottom navigation match the references. The runtime device bezel is intentionally template-owned.
- Colors and visual tokens: pale blue canvas, white cards, green active state, blue data accents, yellow hint treatment, and navy copy map closely to the source palette.
- Image quality and asset fidelity: custom parent/child and parent hint illustrations were generated as transparent watercolor assets and placed at their intended crops; standard controls use Radix icons rather than handmade graphics.
- Copy and content: the learning metrics, conversation topic percentages, non-diagnostic language, change summaries, and voice-prompt wording match the requirements.

## Comparison history

- Initial browser verification found no visual P0/P1/P2 issue. A stale local preview process was replaced with fresh preview ports before the final comparison; this was a preview-state issue, not an app-code design mismatch.
- Final side-by-side comparison required no further P0/P1/P2 visual fixes.

## Follow-up polish

- [P3] A production pass could replace a few library icons with the final Muchimon brand icon set when those assets become available.
- [P3] Real backend data may require additional long-label and zero-data states.

## Implementation checklist

- [x] Mobile runtime integrity check passed.
- [x] Learning and conversation reports implemented.
- [x] Period tabs, bottom navigation, and detail sheet verified.
- [x] Production build passed.
- [x] Sites packaging tests passed.

final result: passed
