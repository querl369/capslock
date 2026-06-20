import { test, expect } from '../helper/fixtures';
import { ZIP, CONTACT, INVALID_EMAIL, INVALID_PHONE } from '../helper/data/test-data';
import {
  advanceToProperty,
  advanceToContact,
  advanceToPhone,
} from '../helper/flows/quiz-flow';

test.describe('Quiz form validation', () => {
  test('ZIP code step enforces a valid, serviced ZIP', async ({ quiz }) => {
    await test.step('empty ZIP does not advance', async () => {
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-1/);
    });

    await test.step('malformed ZIP (too short) does not advance', async () => {
      await quiz.enterZip(ZIP.tooShort);
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-1/);
    });

    await test.step('out-of-area ZIP routes to the notify-me branch', async () => {
      await quiz.enterZip(ZIP.outOfArea);
      await quiz.submitZipAndAwaitResult();
      await expect(quiz.sorryPanel).toBeVisible();
      await expect(quiz.container.getByText(/Sorry/i)).toBeVisible();
      await expect(quiz.notifyEmailInput).toBeVisible();
    });
  });

  /**
   * KNOWN DEFECT: the property step is not marked mandatory — proceeding without a
   * selection shows no validation error. Expected behaviour is an error message, so the
   * second step fails. See README "Defects".
   */
  test('property step requires a selection', async ({ quiz }) => {
    await advanceToProperty(quiz);

    await test.step('proceeding without a selection shows an error', async () => {
      await quiz.proceed();
      await expect(quiz.errorMessage).toBeVisible();
    });
  });

  /**
   * KNOWN DEFECT: the name field silently requires a full (multi-word) name. A valid
   * single-word name is rejected with no feedback, so the second step fails.
   * See README "Defects".
   */
  test('contact step accepts a valid name', async ({ quiz }) => {
    await advanceToContact(quiz);

    await test.step('empty name does not advance', async () => {
      await quiz.fillEmail(CONTACT.validEmail);
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-4/);
    });

    await test.step('a valid name proceeds to the phone step', async () => {
      await quiz.fillName(CONTACT.singleWordName);
      await quiz.fillEmail(CONTACT.validEmail);
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-5/);
    });
  });

  test('contact step enforces native email validation', async ({ quiz }) => {
    await advanceToContact(quiz);
    await quiz.fillName(CONTACT.validName);

    await test.step('empty email is flagged invalid and blocks progress', async () => {
      await quiz.proceed();
      const valid = await quiz.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(valid).toBe(false);
      await expect(quiz.activeStep()).toHaveClass(/step-4/);
    });

    await test.step('malformed email is flagged invalid and blocks progress', async () => {
      await quiz.fillEmail(INVALID_EMAIL.noAt);
      await quiz.proceed();
      const valid = await quiz.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
      expect(valid).toBe(false);
      await expect(quiz.activeStep()).toHaveClass(/step-4/);
    });
  });

  test('phone step requires exactly 10 digits', async ({ quiz }) => {
    await advanceToPhone(quiz);

    await test.step('empty phone does not submit', async () => {
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-5/);
    });

    await test.step('too-few digits does not submit', async () => {
      await quiz.fillPhone(INVALID_PHONE.tooFewDigits);
      await quiz.proceed();
      await expect(quiz.activeStep()).toHaveClass(/step-5/);
    });

    await test.step('non-numeric input is rejected by the field mask', async () => {
      await quiz.fillPhone(INVALID_PHONE.nonNumeric);
      await expect(quiz.phoneInput).toHaveValue('(___)___-____');
    });
  });
});
