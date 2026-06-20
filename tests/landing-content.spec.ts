import { expect } from '@playwright/test';

import { test, } from '../helper/fixtures';

import {
  CONTENT_TEXTS,
  CONTENT_IMAGE_ALTS,
  REVIEW_AUTHORS,
  REVIEW_SECTION_HEADING,
} from '../helper/data/landing-content';

test.describe('Landing page content', () => {
  test('renders all expected copy and imagery', async ({ landing }) => {
    await test.step('all content sections are visible', async () => {
      for (const content of CONTENT_TEXTS) {
        await expect(landing.text(content), `copy: "${content}"`).toBeVisible();
      }
    });

    await test.step('all imagery is present and loaded', async () => {
      for (const alt of CONTENT_IMAGE_ALTS) {
        const image = landing.imageByAlt(alt);
        await expect(image, `image: "${alt}"`).toBeVisible();
        await expect
          .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), {
            message: `image "${alt}" should be loaded`,
          })
          .toBeGreaterThan(0);
      }
    });
  });

  test('review section shows every testimonial', async ({ landing }) => {
    await expect(landing.text(REVIEW_SECTION_HEADING)).toBeVisible();

    for (const author of REVIEW_AUTHORS) {
      await expect(landing.reviewByAuthor(author), `review by: "${author}"`).toBeVisible();
    }

    expect(await landing.reviewRatings.count()).toBeGreaterThanOrEqual(REVIEW_AUTHORS.length);
    for (const rating of await landing.reviewRatings.all()) {
      await expect(rating.locator('.lavin-star')).not.toHaveCount(0);
    }
  });
});
