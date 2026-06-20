import { expect } from '@playwright/test';

import { test } from '../helper/fixtures';

import { ZIP, CONTACT, INTEREST, PROPERTY } from '../helper/data/test-data';

test('completing the quiz with a serviced ZIP reaches the Thank-You page', async ({
  quiz,
  thankYou,
}) => {
  await test.step('Step 1 — ZIP code (serviced area)', async () => {
    await expect(quiz.stepHeading).toHaveText('What is your ZIP Code?');
    await quiz.enterZipCode(ZIP.available);
    await quiz.submitZipAndAwaitResult();
  });

  await test.step('Step 2 — interest', async () => {
    await expect(quiz.progressCurrent).toHaveText('2');
    await quiz.selectInterest(INTEREST.safety);
    await quiz.proceed();
  });

  await test.step('Step 3 — property type', async () => {
    await expect(quiz.progressCurrent).toHaveText('3');
    await quiz.selectProperty(PROPERTY.owned);
    await quiz.proceed();
  });

  await test.step('Step 4 — contact details', async () => {
    await expect(quiz.progressCurrent).toHaveText('4');
    await quiz.fillName(CONTACT.validName);
    await quiz.fillEmail(CONTACT.validEmail);
    await quiz.proceed();
  });

  await test.step('Step 5 — phone number', async () => {
    await expect(quiz.progressCurrent).toHaveText('5');
    await quiz.fillPhone(CONTACT.validPhone);
    await quiz.proceed();
  });

  await test.step('Thank-You page', async () => {
    await expect(thankYou.heading).toBeVisible();
    await expect(thankYou.page).toHaveURL('/\/thankyou/');
    await expect(thankYou.callbackMessage).toBeVisible();
    await expect(thankYou.notSalesCallMessage).toBeVisible();
  });
});
