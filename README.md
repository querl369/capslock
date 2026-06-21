# Capslock Walk-In Bath — Playwright E2E Tests

End-to-end Playwright (TypeScript) tests for the Walk-In Bath landing page at
**https://test-qa.capslock.global**, covering the static content and the multi-step
"quiz" estimate form.

## Requirements

- **Node.js 24.x (LTS).** The repo pins `24.16.0` via `.node-version`.

## Install & run

```bash
npm install
npx playwright install        # download browser binaries
npm test                      # run all tests (chromium + Mobile Safari)
npm run report                # open the last HTML report
```

Useful variants:

```bash
npx playwright test --project=chromium            # one browser
npx playwright test tests/landing-content.spec.ts # one file
npm run test:headed                               # watch it run
```

## Project structure

```
helper/
  data/        test-data.ts, landing-content.ts   # all test data & expected copy (one source)
  pages/       landing.main.ts, quiz.form.ts, landings.thankyou.ts   # page objects (actions + state, no assertions)
  flows/       quiz-flow.ts                        # reusable multi-step navigation, composed from page-object actions
  fixtures.ts                                      # test.extend fixtures: navigated page + page objects
tests/
  landing-content.spec.ts          # static content + reviews
  landing-form-submission.spec.ts  # happy path → Thank-You
  landing-form-validation.spec.ts  # zip, out-of-area, property, name, email, phone, progress
```

Page objects expose **actions and state only**; assertions live in the specs. Setup reuse
is handled by Playwright fixtures, and each test runs in its own isolated context so tests
are independent and CI-reproducible. There are **no explicit waits**: the asynchronous ZIP
availability lookup is covered by Playwright's auto-waiting — the next assertion (e.g. the
step-2 heading or the "sorry" panel becoming visible) waits for the resolved state.

## Scenarios

The page is a single conversion funnel: a long content landing plus a 5-step quiz
(ZIP → interest → property type → name+email → phone → Thank-You), with an out-of-area
"notify me" branch.

**Full candidate scenario list**

1. Happy path — serviced ZIP completes all 5 steps → Thank-You page.
2. Out-of-area ZIP → "notify me" branch.
3. Hero video block — video displayed with a source, badge loaded, benefits listed.
4. Primary content sections & copy render; every content image is loaded.
5. Product gallery renders all expected slides.
6. Reviews — "Show more" reveals the remaining testimonials (and "Show less" collapses them).
7. ZIP validation — empty / malformed.
8. Property step — selection required.
9. Contact step — empty name blocked.
10. Contact step — a (single-word) name is accepted.
11. Email — native HTML5 validation.
12. Phone — exactly 10 digits.
13. Step progress indicator reflects the current step.
14. Back navigation / state persistence (not automated).

**Selected tests (the top 5 are marked ★)** — prioritised to cover the conversion path, both
ZIP branches, every spec-mandated field rule (ZIP / email / phone), and the highest-value
defects. The remaining tests round out coverage of content and the other field rules.

| # | Test | Top 5 | File |
|---|------|:-----:|------|
| Happy path | Serviced ZIP completes the quiz → Thank-You page; asserts the step heading **and** the progress counter on every step (**catches the off-by-one defect**) | ★ | `landing-form-submission.spec.ts` |
| ZIP rules | ZIP step rejects empty and malformed values | ★ | `landing-form-validation.spec.ts` |
| Email rules | Contact step enforces native email validation | ★ | `landing-form-validation.spec.ts` |
| Phone rules | Phone step requires exactly 10 digits | ★ | `landing-form-validation.spec.ts` |
| Out-of-area | Out-of-area ZIP routes to the notify-me branch | ★ | `landing-form-validation.spec.ts` |
| Property | Property step requires a selection | | `landing-form-validation.spec.ts` |
| Name (empty) | Contact step rejects an empty name | | `landing-form-validation.spec.ts` |
| Name (single word) | Contact step accepts a single-word name (**defect**) | | `landing-form-validation.spec.ts` |
| Hero video | Video displayed with a source; badge loaded; benefits listed | | `landing-content.spec.ts` |
| Content | All copy visible; every content image loaded | | `landing-content.spec.ts` |
| Gallery | Product gallery renders all expected slides | | `landing-content.spec.ts` |
| Reviews | "Show more" reveals the remaining testimonials | | `landing-content.spec.ts` |

**Why these 5:** they map directly to the assignment's mandatory form rules — successful
submission ends on the Thank-You page (URL assertion), ZIP determines service availability
(both the valid funnel and the out-of-area branch), and email/phone enforce the exact
validation rules the spec calls out. They are the scenarios whose failure would most directly
break the lead-capture funnel.

Each test is one self-contained scenario; multi-input rules (ZIP, phone) use `test.step` for an
empty-state case followed by invalid-value cases.

## Defects

Two tests assert how the page should behave, so they fail against today's buggy page. We let them
fail instead of masking the result: the suite stays an honest report, a broken page shows red, and
each test turns green when its bug is fixed. Read them as executable bug reports. CI runs red until
these two land.

**Defects with a failing test**

1. **The step counter is off by one.** On the property step (step 3) it reads "2 of 5" instead of
   "3 of 5". Across the funnel the counter goes 1, 2, 2, 4, 5
   (`#form-container-1 [data-form-progress-current-step]`). To reproduce, enter a serviced ZIP,
   pick an interest, and land on the property step: the counter still says 2. Covered by the
   happy-path test `completing the quiz with a serviced ZIP reaches the Thank-You page`, which
   checks the counter on every step.
2. **The "Name" field demands a full name.** The label says "Name", yet `John` is rejected with
   *"Your full name should contain both first and last name."* and the form stays on step 4.
   Expected behaviour: accept a single name, or relabel the field "Full name". Covered by
   `contact step accepts a single-word name`.

**Defects found, not yet automated**

3. **The page renders the quiz twice.** Two widgets ship in the markup, `#form-container-1` and
   `#form-container-2`, so every control and its `id` exists in duplicate. Duplicate `id`s break
   the HTML contract and any `getElementById`/label association. The tests scope to the first
   widget to stay deterministic.
4. **The out-of-area notify form drops the lead.** On the "sorry" branch (ZIP `11111`), typing an
   email and submitting fires no `fetch` or `XHR`, yet the panel swaps in "Thank you for your
   interest, we will contact you...". The visitor sees success while the backend gets nothing. A
   regression test would route-intercept the submit and assert a request goes out.

**UX / minor issues**

- The property step gives no "required" cue. Step 3 (single-select, required) looks identical to
  step 2 (*"select all that apply"*, optional), so the requirement surfaces only as
  *"Choose one of the variants."* after you press *Next*. The validation works, and the green test
  `property step requires a selection` covers it.
- The out-of-area email field uses `type="text"`, so the browser skips native email validation.
- The ZIP field accepts letters while you type (`type="tel"`, no `pattern`/`maxlength`) and rejects
  them only on submit (*"Wrong ZIP code."*).
- Inputs rely on placeholders instead of `<label>`/`aria`, which hurts screen-reader users and
  forces placeholder-based locators. The styled option cards also hide the real `<input>`, so a
  test picks an interest or property by clicking the visible label.

## Future improvements

1. **Add stable test hooks.** Request `data-testid` attributes (and real `<label>`s) from
   the dev team so locators stop depending on copy/placeholder text.
2. **Mock the ZIP availability API.** Stubbing the lookup removes the ~6s spinner wait,
   makes serviced/out-of-area flows deterministic, and speeds up CI.
3. **Add visual-regression and accessibility checks.** Snapshot key sections and run an
   axe/a11y pass — valuable for a design-owned landing page that changes often.
4. **Expand the browser/device matrix** (more mobile viewports, real WebKit/Edge) once the
   above stabilizes the core flows.
