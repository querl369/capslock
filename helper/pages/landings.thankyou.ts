import { Locator, Page } from '@playwright/test';

/**
 * Page object for the post-submission "Thank you" page (/thankyou).
 * Exposes state only — assertions live in the tests.
 */
export class ThankYouPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly callbackMessage: Locator;
  readonly notSalesCallMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Thank you!' });
    this.callbackMessage = page.getByText('We will be calling within the');
    this.notSalesCallMessage = page.getByText('This is not a sales call');
  }

  pathname(): string {
    return new URL(this.page.url()).pathname;
  }
}
