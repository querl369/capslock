import { expect } from '@playwright/test';

import { test } from '../helper/fixtures';

import { ZIP, CONTACT, INTEREST, PROPERTY, STEP } from '../helper/data/test-data';

test('completing the quiz with a serviced ZIP reaches the Thank-You page', async ({
  quiz,
  thankYou,
}) => {
  // Fails today on the step-3 counter (off-by-one defect, see README). The assertion is correct;
  // the page is wrong. We let it fail rather than mask it.
  await test.step('Step 1 — ZIP code (serviced area)', async () => {
    await expect(quiz.stepHeading(STEP.zip)).toHaveText('What is your ZIP Code?');
    // The progress indicator is not shown on the ZIP step; it appears from step 2 on.
    await expect(quiz.progressCurrent).toBeHidden();

    await expect(quiz.zipInput).toBeVisible();
    await expect(quiz.zipInput).toHaveValue('');
    await quiz.enterZip(ZIP.available);
    await expect(quiz.zipInput).toHaveValue(ZIP.available);

    await quiz.submitStep(STEP.zip);
    await expect(quiz.step(STEP.zip)).toBeHidden();
    await expect(quiz.step(STEP.interest)).toBeVisible();
  });

  await test.step('Step 2 — interest', async () => {
    await expect(quiz.stepHeading(STEP.interest)).toContainText('Why are you interested in a walk-in tub?');

    for (const option of Object.values(INTEREST)) {
      await expect(quiz.interestCard(option), `option: "${option}"`).toBeVisible();
    }

    await expect(quiz.interestOption(INTEREST.safety)).not.toBeChecked();
    await quiz.chooseInterest(INTEREST.safety);
    await expect(quiz.interestOption(INTEREST.safety)).toBeChecked();

    await expect(quiz.progressCurrent).toBeVisible();
    await expect(quiz.progressCurrent).toHaveText(String(STEP.interest));

    await quiz.submitStep(STEP.interest);
    await expect(quiz.step(STEP.interest)).toBeHidden();
    await expect(quiz.step(STEP.property)).toBeVisible();
  });

  await test.step('Step 3 — property type', async () => {
    await expect(quiz.stepHeading(STEP.property)).toHaveText('What type of property is this for?');

    for (const option of Object.values(PROPERTY)) {
      await expect(quiz.propertyCard(option), `option: "${option}"`).toBeVisible();
    }

    await expect(quiz.propertyOption(PROPERTY.owned)).not.toBeChecked();
    await quiz.chooseProperty(PROPERTY.owned);
    await expect(quiz.propertyOption(PROPERTY.owned)).toBeChecked();

    await expect(quiz.progressCurrent).toBeVisible();
    await expect(quiz.progressCurrent).toHaveText(String(STEP.property));

    await quiz.submitStep(STEP.property);
    await expect(quiz.step(STEP.property)).toBeHidden();
    await expect(quiz.step(STEP.contact)).toBeVisible();
  });

  await test.step('Step 4 — contact details', async () => {
    await expect(quiz.stepHeading(STEP.contact)).toContainText('Who should we prepare this');

    await expect(quiz.nameInput).toBeVisible();
    await expect(quiz.emailInput).toBeVisible();
    await expect(quiz.nameInput).toHaveValue('');
    await expect(quiz.emailInput).toHaveValue('');
    await quiz.fillName(CONTACT.validName);
    await quiz.fillEmail(CONTACT.validEmail);
    await expect(quiz.nameInput).toHaveValue(CONTACT.validName);
    await expect(quiz.emailInput).toHaveValue(CONTACT.validEmail);

    await expect(quiz.progressCurrent).toBeVisible();
    await expect(quiz.progressCurrent).toHaveText(String(STEP.contact));

    await quiz.submitStep(STEP.contact);
    await expect(quiz.step(STEP.contact)).toBeHidden();
    await expect(quiz.step(STEP.phone)).toBeVisible();
  });

  await test.step('Step 5 — phone number', async () => {
    await expect(quiz.stepHeading(STEP.phone)).toHaveText('LAST STEP!');

    await expect(quiz.phoneInput).toBeVisible();
    await expect(quiz.phoneInput).toHaveValue('');
    await quiz.fillPhone(CONTACT.validPhone);
    await expect(quiz.phoneInput).toHaveValue('(555)123-4567');

    await expect(quiz.progressCurrent).toBeVisible();
    await expect(quiz.progressCurrent).toHaveText(String(STEP.phone));

    await quiz.submitStep(STEP.phone);
  });

  await test.step('Thank-You page', async () => {
    await expect(thankYou.page).toHaveURL(/\/thankyou/);
    await expect(thankYou.heading).toBeVisible();
    await expect(thankYou.callbackMessage).toContainText('We will be calling within the');
    await expect(thankYou.notSalesCallMessage).toContainText('This is not a sales call');
  });
});
