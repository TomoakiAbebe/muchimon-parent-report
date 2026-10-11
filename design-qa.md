# Design QA — Muchimon Parent Reports

## Comparison target

- Source visual truth path: `public/assets/reference/children-reference.png`, plus the existing learning and chat references.
- Browser-rendered implementation: `http://127.0.0.1:4180/#children`.
- Implementation screenshot evidence: the browser-rendered children screen embedded in `public/qa.html` and captured as a full-page comparison in the Codex in-app browser.
- Combined comparison artifact path: `public/qa.html`.
- Source pixels: children `853 × 1875`; learning and chat `942 × 1536`.
- Implementation CSS viewport: iPhone app screen `393 × 852` at device scale factor 1; the comparison board was viewed at `1400 × 1200`.
- State: child selection list, learning / 1週間, and chat / 1か月.

## Evidence reviewed

- Full-view comparison: the selected pictogram mock and browser-rendered children list were displayed side by side on the QA board.
- Focused comparison: the direct `#children` screen was inspected at the unscaled mobile runtime size for type, card spacing, icon treatment, CTA placement, and bottom content clearance.
- Primary interactions tested: select あい, open learning report, switch to おしゃべり, return to the child list, open/close お子さま追加, and open/close あいの設定.
- Console errors checked: no warnings or errors.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: the Japanese display hierarchy, weights, line heights, and compact support copy follow the selected reference without truncation.
- Spacing and layout rhythm: hero, two stacked profile cards, full-width CTAs, add-child control, and privacy note retain the reference's ordering and rounded-card cadence.
- Colors and visual tokens: pale blue canvas, white cards, green CTAs, navy text, and restrained yellow/blue identity accents match the approved direction.
- Image quality and asset fidelity: child identities use neutral Radix person pictograms rather than portraits or character illustrations. The pictograms are crisp at runtime density and preserve the approved neutral treatment.
- Copy and content: the child names, grades, weekly learning summary, conversation summary, add-child label, and privacy note match the selected concept.
- Accessibility and interaction: child selection, labeled settings buttons, report navigation, and sheets are keyboard/semantic-button accessible.

## Comparison history

- Iteration 1 found a P1 color-class collision that filled the entire child cards with yellow and blue instead of keeping the approved white-card surfaces.
- Fix: renamed child tone classes to scoped `child-tone-*` selectors and limited color to the pictogram/backdrop accents.
- Post-fix evidence: the direct browser view and refreshed side-by-side QA board show white cards with soft yellow/blue identity treatments; no actionable P0/P1/P2 mismatch remains.

## Follow-up polish

- [P3] Final brand pictograms can replace the library person glyphs when the Muchimon production icon set is available.
- [P3] Production data should add long-name, no-activity, and more-than-two-children states.

## Implementation checklist

- [x] Child list is the initial screen.
- [x] Pictogram identities replace child illustrations.
- [x] Child selection opens that child's report.
- [x] Learning/chat switching and return navigation work.
- [x] Add-child and settings sheets work.
- [x] Mobile runtime integrity, production build, and Sites packaging tests pass.

final result: passed
