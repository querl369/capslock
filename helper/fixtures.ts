import { test as base } from '@playwright/test';
import { LandingMain } from './pages/landing.main';
import { QuizForm } from './pages/quiz.form';
import { ThankYouPage } from './pages/landings.thankyou';

type Fixtures = {
  landing: LandingMain;
  quiz: QuizForm;
  thankYou: ThankYouPage;
};

export const test = base.extend<Fixtures>({
  landing: async ({ page }, use) => {
    const landing = new LandingMain(page);
    await landing.page.goto('/');
    await use(landing);
  },

  // `quiz` depends on `landing` so the page is always navigated before form interaction.
  quiz: async ({ landing, page }, use) => {
    void landing;
    await use(new QuizForm(page));
  },

  thankYou: async ({ page }, use) => {
    await use(new ThankYouPage(page));
  },
});
