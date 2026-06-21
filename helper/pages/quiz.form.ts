import { Locator, Page } from '@playwright/test';

export class QuizForm {
  readonly page: Page;
  readonly form: Locator;
  readonly zipInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly notifyEmailInput: Locator;
  readonly progressCurrent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#form-container-1');
    this.zipInput = this.form.getByRole('textbox', { name: 'Enter ZIP Code' });
    this.nameInput = this.form.getByRole('textbox', { name: 'Enter Your Name' });
    this.emailInput = this.form.getByRole('textbox', { name: 'Enter Your Email' });
    this.phoneInput = this.form.getByRole('textbox', { name: '(XXX)XXX-XXXX' });
    // Email capture shown on the out-of-area ("sorry") branch.
    this.notifyEmailInput = this.form.getByRole('textbox', { name: 'Email Address' });
    this.progressCurrent = this.form.locator('[data-form-progress-current-step]');
  }

  step(n: number): Locator {
    return this.form.locator(`.steps.step-${n}`);
  }

  stepHeading(n: number): Locator {
    return this.step(n).locator('.stepTitle__hdr');
  }

  errorFor(n: number): Locator {
    return this.step(n).locator('.helpBlock[data-error-block]');
  }

  buttonNext(n: number): Locator {
    return this.form.locator(`button[type="submit"][data-tracking="btn-step-${n}"]`);
  }

  interestCard(label: string): Locator {
    return this.step(2).getByText(label, { exact: true });
  }

  propertyCard(label: string): Locator {
    return this.step(3).getByText(label, { exact: true });
  }

  /** The (visually hidden) interest checkbox behind an option card — used to assert its checked state. */
  interestOption(label: string): Locator {
    return this.step(2).locator(`input[value="${label}"]`);
  }

  /** The (visually hidden) property radio behind an option card — used to assert its checked state. */
  propertyOption(label: string): Locator {
    return this.step(3).locator(`input[value="${label}"]`);
  }

  get sorryPanel(): Locator {
    return this.form.locator('.steps.step-sorry');
  }

  async enterZip(zip: string): Promise<void> {
    await this.zipInput.fill(zip);
  }

  async chooseInterest(label: string): Promise<void> {
    await this.interestCard(label).click();
  }

  async chooseProperty(label: string): Promise<void> {
    await this.propertyCard(label).click();
  }

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async submitStep(n: number): Promise<void> {
    await this.buttonNext(n).click();
  }

  async getEmailValidationData(): Promise<{ valid: boolean, message: string }> {
    const { valid, message } = await this.emailInput
      .evaluate((el: HTMLInputElement) => ({
        valid: el.validity.valid,
        message: el.validationMessage,
    }))
    return { valid, message };
  }
}
