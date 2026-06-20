import { Locator, Page } from '@playwright/test';
import { REVIEW_SECTION_HEADING } from '../data/landing-content';

/**
 * Page object for the static content of the Walk-In Bath landing page
 * (hero, benefit sections, image galleries, and the reviews block).
 *
 * Exposes navigation plus locator builders for content — assertions live in the tests.
 */
export class LandingMain {
  readonly page: Page;
  readonly reviewSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reviewSection = page
      .locator('section')
      .filter({ hasText: REVIEW_SECTION_HEADING });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** A visible occurrence of the given copy. */
  text(content: string): Locator {
    return this.page.getByText(content, { exact: false }).first();
  }

  /** First image with the given accessible (alt) name. */
  imageByAlt(alt: string): Locator {
    return this.page.getByRole('img', { name: alt }).first();
  }

  reviewByAuthor(author: string): Locator {
    return this.page.getByText(author, { exact: false }).first();
  }

  /** Star-rating widgets within the review section. */
  get reviewRatings(): Locator {
    return this.reviewSection.locator('.review__ratingStars');
  }
}
