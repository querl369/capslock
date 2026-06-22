import { expect, type Locator } from '@playwright/test';

import { test } from '../helper/fixtures';

import {
  CONTENT_TEXTS,
  CONTENT_IMAGE_ALTS,
  HERO_BENEFITS,
  CAROUSEL_SLIDE_COUNT,
  VISIBLE_REVIEW_AUTHORS,
  HIDDEN_REVIEW_AUTHORS,
  REVIEW_COUNT_TOTAL,
  REVIEW_SECTION_HEADING,
} from '../helper/data/landing-content';

/** Assert an <img> finished loading (decoded with a real intrinsic size). */
async function expectImageLoaded(image: Locator, label: string): Promise<void> {
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth), {
      message: `image "${label}" should be loaded`,
    })
    .toBeGreaterThan(0);
}

test.describe('Landing page content', () => {
  test('renders all content and the reviews "Show more" toggle works', async ({ landing }) => {
    await test.step('hero video block displays the video and lists all benefits', async () => {
      await test.step('the hero video is displayed with a source', async () => {
        await expect(landing.heroVideo).toBeVisible();
        await expect(landing.heroVideo).toHaveAttribute('src', /.+/);
      });

      await test.step('the "Proudly American" badge is loaded', async () => {
        await expect(landing.proudlyAmericanBadge).toBeVisible();
        await expectImageLoaded(landing.proudlyAmericanBadge, 'Proudly American');
      });

      await test.step('every benefit is listed', async () => {
        for (const benefit of HERO_BENEFITS) {
          await expect(landing.heroBenefit(benefit), `benefit: "${benefit}"`).toBeVisible();
        }
      });
    });

    await test.step('renders all primary content sections and copy', async () => {
      await test.step('all copy is visible', async () => {
        for (const content of CONTENT_TEXTS) {
          await expect(landing.text(content), `copy: "${content}"`).toBeVisible();
        }
      });

      await test.step('all imagery is loaded', async () => {
        for (const alt of CONTENT_IMAGE_ALTS) {
          const image = landing.imageByAlt(alt);
          await expect(image, `image: "${alt}"`).toBeVisible();
          await expectImageLoaded(image, alt);
        }
      });
    });

    await test.step('product gallery renders all slides', async () => {
      await expect(landing.carousel).toBeVisible();
      await expect(landing.carouselSlides).toHaveCount(CAROUSEL_SLIDE_COUNT);
      await expectImageLoaded(landing.carouselActiveImage, 'active gallery slide');
    });

    await test.step('customer reviews — "Show more" reveals the remaining reviews', async () => {
      await expect(landing.text(REVIEW_SECTION_HEADING)).toBeVisible();
      await expect(landing.reviews).toHaveCount(REVIEW_COUNT_TOTAL);

      await test.step('only the first batch of reviews is shown initially', async () => {
        for (const author of VISIBLE_REVIEW_AUTHORS) {
          await expect(landing.review(author), `visible: "${author}"`).toBeVisible();
        }
        for (const author of HIDDEN_REVIEW_AUTHORS) {
          await expect(landing.review(author), `hidden: "${author}"`).toBeHidden();
        }
      });

      await test.step('each visible review has a name, five stars and a comment', async () => {
        for (const author of VISIBLE_REVIEW_AUTHORS) {
          await expect(landing.reviewStars(author), `stars: "${author}"`).toHaveCount(5);
          await expect(landing.reviewComment(author), `comment: "${author}"`).not.toBeEmpty();
        }
      });

      await test.step('"Show more" reveals the rest and flips the label', async () => {
        await landing.showMoreReviews();
        for (const author of HIDDEN_REVIEW_AUTHORS) {
          await expect(landing.review(author), `revealed: "${author}"`).toBeVisible();
        }
        await expect(landing.showMoreLabel).toHaveText('Show less');
      });

      await test.step('"Show less" collapses back to the first batch', async () => {
        await landing.showMoreReviews();
        for (const author of HIDDEN_REVIEW_AUTHORS) {
          await expect(landing.review(author), `re-hidden: "${author}"`).toBeHidden();
        }
        await expect(landing.showMoreLabel).toHaveText('Show more');
      });
    });
  });
});
