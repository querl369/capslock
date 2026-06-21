import { expect } from '@playwright/test';

import { test } from '../helper/fixtures';

import { ZIP, CONTACT, INVALID_EMAIL, INVALID_PHONE, STEP } from '../helper/data/test-data';

import {
  advanceToProperty,
  advanceToContact,
  advanceToPhone,
} from '../helper/flows/quiz-flow';

test.describe('Quiz form validation', () => {
  test('ZIP step rejects empty and malformed values', async ({ quiz }) => {
    await test.step('empty ZIP shows an error and stays on step 1', async () => {
      await quiz.submitStep(STEP.zip);
      await expect(quiz.errorFor(STEP.zip)).toHaveText('Enter your ZIP code.');
      await expect(quiz.step(STEP.zip)).toBeVisible();
    });

    await test.step('too-short ZIP shows a "wrong ZIP" error', async () => {
      await quiz.enterZip(ZIP.tooShort);
      await quiz.submitStep(STEP.zip);
      await expect(quiz.errorFor(STEP.zip)).toHaveText('Wrong ZIP code.');
    });

    await test.step('non-numeric ZIP shows a "wrong ZIP" error', async () => {
      await quiz.enterZip(ZIP.nonNumeric);
      await quiz.submitStep(STEP.zip);
      await expect(quiz.errorFor(STEP.zip)).toHaveText('Wrong ZIP code.');
    });
  });

  test('out-of-area ZIP routes to the notify-me branch', async ({ quiz }) => {
    await quiz.enterZip(ZIP.outOfArea);
    await quiz.submitStep(STEP.zip);

    await expect(quiz.sorryPanel).toBeVisible();
    await expect(quiz.sorryPanel).toContainText('install in your area');
    await expect(quiz.notifyEmailInput).toBeVisible();
  });

  test('property step requires a selection', async ({ quiz }) => {
    await advanceToProperty(quiz);

    await quiz.submitStep(STEP.property);
    await expect(quiz.errorFor(STEP.property)).toHaveText('Choose one of the variants.');
    await expect(quiz.step(STEP.property)).toBeVisible();
  });

  test('contact step rejects an empty name', async ({ quiz }) => {
    await advanceToContact(quiz);

    await quiz.fillEmail(CONTACT.validEmail);
    await quiz.submitStep(STEP.contact);

    await expect(quiz.step(STEP.contact).getByText('Please enter your name.')).toBeVisible();
    await expect(quiz.step(STEP.phone)).toBeHidden();
  });

  test('contact step enforces native HTML email validation', async ({ quiz }) => {
    await advanceToContact(quiz);
    await quiz.fillName(CONTACT.validName);

    const expectEmailRejected = async () => {
      const { valid, message } = await quiz.getEmailValidationData();
      expect(valid).toBe(false);
      expect(message.length).toBeGreaterThan(0);
      await expect(quiz.step(STEP.contact)).toBeVisible();
    };

    await test.step('empty email is flagged invalid and blocks progress', async () => {
      await quiz.submitStep(STEP.contact);
      await expectEmailRejected();
    });

    for (const malformedEmail of [INVALID_EMAIL.noAt, INVALID_EMAIL.noDomain]) {
      await test.step(`malformed email "${malformedEmail}" is flagged invalid and blocks progress`, async () => {
        await quiz.fillEmail(malformedEmail);
        await quiz.submitStep(STEP.contact);
        await expectEmailRejected();
      });
    }
  });

  test('phone step requires exactly 10 digits', async ({ quiz }) => {
    await advanceToPhone(quiz);

    await test.step('empty phone shows an error and stays on step 5', async () => {
      await quiz.submitStep(STEP.phone);
      await expect(quiz.errorFor(STEP.phone)).toHaveText('Enter your phone number.');
      await expect(quiz.step(STEP.phone)).toBeVisible();
    });

    await test.step('too-few digits shows a "wrong phone" error', async () => {
      await quiz.fillPhone(INVALID_PHONE.tooFewDigits);
      await quiz.submitStep(STEP.phone);
      await expect(quiz.errorFor(STEP.phone)).toHaveText('Wrong phone number.');
    });

    await test.step('non-numeric input is rejected by the field mask', async () => {
      await quiz.fillPhone(INVALID_PHONE.nonNumeric);
      await expect(quiz.phoneInput).toHaveValue('(___)___-____');
    });
  });

  /**
   * DEFECT (fails on purpose): the field is labelled "Name", but a valid single-word name is
   * rejected with "Your full name should contain both first and last name." and does not advance.
   * Expected: a name accepts a name. See README "Defects".
   */
  test('contact step accepts a single-word name', async ({ quiz }) => {
    await advanceToContact(quiz);

    await quiz.fillName(CONTACT.singleWordName);
    await quiz.fillEmail(CONTACT.validEmail);
    await quiz.submitStep(STEP.contact);

    await expect(quiz.step(STEP.phone)).toBeVisible();
  });
});
