import { Locator, Page } from '@playwright/test';
import { REVIEW_SECTION_HEADING } from '../data/landing-content';

/** Root of the "Built To Last A Lifetime" slick gallery. */
const MAIN_SLIDER = '[data-main-slider]';

/** Landing-page content page object: exposes locators and actions, no assertions. */
export class LandingMain {
  readonly page: Page;

  readonly heroVideo: Locator;
  readonly proudlyAmericanBadge: Locator;

  readonly carousel: Locator;
  readonly carouselSlides: Locator;
  readonly carouselActiveImage: Locator;

  readonly reviewSection: Locator;
  readonly reviews: Locator;
  readonly showMoreToggle: Locator;
  readonly showMoreLabel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heroVideo = page.locator('[data-main-video] video');
    this.proudlyAmericanBadge = this.imageByAlt('Proudly American');

    this.carousel = page.locator(MAIN_SLIDER);
    this.carouselSlides = this.carousel.locator('.slick-slide:not(.slick-cloned)');
    this.carouselActiveImage = this.carousel.locator('.slick-current img');

    this.reviewSection = page
      .locator('section')
      .filter({ hasText: REVIEW_SECTION_HEADING });
    this.reviews = this.reviewSection.locator('.review');
    this.showMoreToggle = this.reviewSection.locator('.moreless');
    this.showMoreLabel = this.reviewSection.locator('.moreless__txt');
  }

  text(content: string): Locator {
    return this.page.getByText(content, { exact: false }).first();
  }

  imageByAlt(alt: string): Locator {
    return this.page.getByRole('img', { name: alt }).first();
  }

  heroBenefit(text: string): Locator {
    return this.page.locator('.hero .blockList').getByText(text, { exact: true });
  }

  review(author: string): Locator {
    return this.reviews.filter({ hasText: author });
  }

  reviewStars(author: string): Locator {
    return this.review(author).locator('.lavin-star');
  }

  reviewComment(author: string): Locator {
    return this.review(author).locator('.review__comment');
  }

  async showMoreReviews(): Promise<void> {
    await this.showMoreToggle.click();
  }
}
