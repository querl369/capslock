import { Locator, Page } from '@playwright/test';

/** Thank-you page object: exposes state only, no assertions. */
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
}
