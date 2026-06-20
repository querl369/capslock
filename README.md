# Capslock Walk-In Bath — Playwright E2E Tests

End-to-end Playwright (TypeScript) tests for the Walk-In Bath landing page at
**https://test-qa.capslock.global**, covering the static content and the multi-step
"quiz" estimate form.

## Requirements

- **Node.js 24.x (LTS).** The repo pins `24.16.0` via `.node-version`.
  > ⚠️ Node **23.9.0** is unsupported: Playwright's TypeScript loader throws
  > `TypeError: context.conditions?.includes is not a function` when importing local
  > `.ts` modules (page objects/fixtures). Node 22.x and 24.x both work; CI uses `lts/*`.

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
  landing-content.spec.ts          # T1 content, T2 reviews
  landing-form-submission.spec.ts  # T3 happy path → Thank You
  landing-form-validation.spec.ts  # T4 zip, T5 property, T6 name, T7 email, T8 phone
```

Page objects expose **actions and state only**; assertions live in the specs. Setup reuse
is handled by Playwright fixtures, and each test runs in its own isolated context so tests
are independent and CI-reproducible. The form auto-waits on Playwright's built-ins; the one
explicit wait is the asynchronous ZIP availability lookup (`submitZipAndAwaitResult`), which
waits for the resulting panel rather than a fixed delay.

## Scenarios

The page is a single conversion funnel: a long content landing plus a 5-step quiz
(ZIP → interest → property type → name+email → phone → Thank-You), with an out-of-area
"notify me" branch.

**Full candidate scenario list**

1. Happy path — serviced ZIP completes all 5 steps → Thank-You page.
2. Out-of-area ZIP → "notify me" branch.
3. Page renders all expected content (copy + imagery).
4. Review section shows all testimonials.
5. ZIP validation — empty / malformed / out-of-area.
6. Interest step — selection behavior.
7. Property step — selection required.
8. Contact step — name accepted, email validated.
9. Email — native HTML5 validation.
10. Phone — exactly 10 digits.
11. Step progress indicator increments correctly.
12. Back navigation / state persistence.

**Selected tests (8)** — chosen to cover the conversion path, both ZIP branches, every
spec-mandated field rule (ZIP / email / phone), the progress contract, and the page content
the design team owns:

| # | Test | File |
|---|------|------|
| T1 | Renders all expected copy and imagery | `landing-content.spec.ts` |
| T2 | Review section shows every testimonial | `landing-content.spec.ts` |
| T3 | Serviced ZIP completes the quiz → Thank-You (asserts progress each step) | `landing-form-submission.spec.ts` |
| T4 | ZIP step: empty / malformed / out-of-area branch | `landing-form-validation.spec.ts` |
| T5 | Property step requires a selection | `landing-form-validation.spec.ts` |
| T6 | Contact step accepts a valid name; empty name blocked | `landing-form-validation.spec.ts` |
| T7 | Contact step enforces native email validation | `landing-form-validation.spec.ts` |
| T8 | Phone step requires exactly 10 digits | `landing-form-validation.spec.ts` |

Validation tests follow a consistent shape: an **empty-state** step first, then an
**invalid-value** step, each as its own `test.step`.

## Bugs

Tests are written to **expected** behavior, so the tests covering the defects below
**fail on purpose** — they are the executable bug reports and will turn green once the bugs
are fixed.

**Confirmed defects (failing tests)**

1. **Step indicator is off by one (T3).** On the *property* step the progress indicator
   shows **"2 of 5"** instead of "3 of 5"; the sequence runs 2 → 2 → 4 → 5
   (`span.stepProgress__stepCurrent`). *Repro:* enter a serviced ZIP, pick an interest,
   reach the property step — the counter still reads 2.
2. **Property step is not mandatory (T5).** Clicking *Next* with no property selected does
   not advance **and shows no validation error** — the user gets stuck with no feedback.
   *Expected:* an inline error message.
3. **Name field silently demands a full name (T6).** A valid single-word name (e.g. `John`)
   is rejected with no error and no progress; only a multi-word name (`John Smith`) advances.
   *Expected:* a valid name proceeds, or a clear error explains the requirement.

**Minor / UX issues (not asserted as failures)**

- The ZIP input has no `required` / `maxlength` / `pattern` attributes; all validation is
  client-side JS and easily bypassable.
- The out-of-area "notify me" email field is `type="text"` (not `type="email"`), so it lacks
  native HTML5 email validation.
- Invalid phone input is silently blocked with no inline error message (the input mask
  enforces digits, but there is no feedback explaining the 10-digit requirement).
- Form inputs rely on placeholders rather than `<label>`/`aria` — this hurts accessibility
  and forces placeholder-based locators instead of clean role/label locators.
- The quiz widget is duplicated on the page (`#form-container-1` and `#form-container-2`);
  tests scope to the first to stay deterministic.

## Future improvements

1. **Add stable test hooks.** Request `data-testid` attributes (and real `<label>`s) from
   the dev team so locators stop depending on copy/placeholder text.
2. **Mock the ZIP availability API.** Stubbing the lookup removes the ~6s spinner wait,
   makes serviced/out-of-area flows deterministic, and speeds up CI.
3. **Add visual-regression and accessibility checks.** Snapshot key sections and run an
   axe/a11y pass — valuable for a design-owned landing page that changes often.
4. **Expand the browser/device matrix** (more mobile viewports, real WebKit/Edge) once the
   above stabilizes the core flows.
