import { test, expect } from '../helper/fixtures';
import { ZIP, CONTACT, INTEREST, PROPERTY } from '../helper/data/test-data';

/**
 * End-to-end happy path: a serviced ZIP code completes the 5-step quiz and lands on
 * the Thank-You page. The progress indicator is asserted at every step.
 *
 * KNOWN DEFECT: on the property step the indicator reads "2 of 5" instead of "3 of 5",
 * so this test currently fails at Step 3. See README "Defects".
 */
test('completing the quiz with a serviced ZIP reaches the Thank-You page', async ({
  quiz,
  thankYou,
}) => {
  await test.step('Step 1 — ZIP code (serviced area)', async () => {
    await expect(quiz.stepHeading).toHaveText('What is your ZIP Code?');
    await quiz.enterZip(ZIP.available);
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
    expect(thankYou.pathname()).toBe('/thankyou');
    await expect(thankYou.callbackMessage).toBeVisible();
    await expect(thankYou.notSalesCallMessage).toBeVisible();
  });
});
