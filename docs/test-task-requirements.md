# QA Team Lead Test Task (Design team) — Requirements

> Decoded from `QA Team Lead Test task (Design team) (2).pdf`. The source is a Google-Docs
> subset-font PDF; text was reconstructed from the embedded ToUnicode CMaps. A few glyphs
> originally decoded as digits (T→1, S→0/6) due to the subset font and have been corrected.

## Part 1 — Tech Assignment

Analyze the test page (Capslock "Here's Why Americans Choose This Walk-In Bath…").

**Your task**
- Implement automated tests for the highest-priority scenarios using Playwright (TypeScript/JavaScript).
- Test volume: write **at least 5 end-to-end automated tests**, where each test represents one
  complete user scenario.
- If you discover defects:
  - Implement the tests according to **expected** behavior, not current behavior.
  - Briefly describe each defect in your README.

**Form requirements** — the form on the page must follow these rules:
- All fields are required.
- **Zip code:** must consist of exactly 5 digits and is used to determine service availability.
  Different valid zip codes may lead to different user flows, for example: service available `68901`,
  out-of-area `11111`.
- **Email:** must be validated using native HTML5 email validation.
- **Phone number:** must contain exactly 10 digits.
- After successful submission, the user must be redirected to the "Thank you" page.

**Implementation Expectations (what we evaluate)** — the solution should be clear, readable, and
maintainable, using an appropriate level of structure and abstraction.

- **Test Design**
  - Each test must be independently runnable and focused on exactly one user scenario — a test that
    covers multiple unrelated scenarios is considered a structural defect.
  - Tests should be reproducible and suitable for CI execution.
- **Locators & Waiting Strategy**
  - Prefer semantically meaningful locators that reflect how a real user interacts with the page
    (role, label, accessible name). Avoid positional or index-based selection unless there is no
    alternative.
  - Rely on Playwright's built-in auto-waiting capabilities. Introduce explicit waits only when
    strictly necessary, and document the reason.
- **Assertions**
  - Assertions must validate specific, meaningful outcomes — including error message content, URL
    state after navigation, and visible state transitions. Asserting only that an element exists is
    not sufficient.
  - Assertions belong in the test layer. Page Object classes should expose actions and state, not
    make assertions.
- **Architecture & Code Structure**
  - Make use of Playwright's built-in mechanisms for setup reuse and shared context across tests
    rather than repeating initialization code manually.
  - Each method or helper should have a single, clearly defined responsibility. Avoid methods that
    combine navigation, form interaction, and assertion in one call.
  - Avoid code duplication — locators, test data, and interaction patterns should be defined once and
    reused.
- **Code Quality**
  - Submit only production-ready code. Remove unused imports, variables, methods, and commented-out
    blocks before submission.
  - Test names, structure, and organization should make intent self-evident without needing inline
    comments.

**Deliverables** — a public GitHub repository with a single NPM project, which includes:
- Automated Tests Solution — Playwright-based tests implemented according to the assignment.
- `README.md` — with clear instructions on how to install dependencies and run the tests
  (e.g., `npm install`, `npx playwright test`).
  - the full list of scenarios and the selected top 5
  - explanation of why these 5 were chosen
  - brief defect descriptions (if any)
  - 2–4 ideas for improving the framework in the future

## Part 2 — Written Evaluation

Please answer all questions (separate Written Evaluation Document, PDF, expected total length 1–1.5 pages):

1. **Managing Manual QA + Automation QA.** You will be responsible for both Manual and Automation
   engineers. How would you organize the work between these roles to ensure: efficient testing of
   landing pages; clear ownership and task distribution; smooth collaboration and communication;
   predictable delivery within sprints?
2. **Inheriting an Existing Playwright Project.** You join a team where automation already exists.
   What are your first steps to: understand the current state of the framework and tests; stabilize
   the test runs; introduce coding and structural standards; prepare the project for long-term
   maintainability?
3. **Working with Designers.** Designers frequently update landing pages. How would you: ensure QA
   and Design stay aligned on quality expectations; prevent misunderstandings regarding visual
   changes; integrate appropriate quality checks into the workflow?
4. **Challenging Situation.** Describe one difficult situation you faced in QA or test automation.
   Include: what happened; what decision you made; how you communicated with the team and
   stakeholders; what you learned from the experience.
