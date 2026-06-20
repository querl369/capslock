import { Locator, Page } from '@playwright/test';

export class QuizForm {
  readonly page: Page;
  readonly form: Locator;
  readonly inputZipCode: Locator;
  readonly inputName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#form-container-1');
    this.inputZipCode = this.form.getByRole('textbox', { name: 'Enter ZIP Code' });
    this.inputName = this.form.getByRole('textbox', { name: 'Enter Your Name' });
  }

  buttonNext(stepNumber: number): Locator {
    return this.form.locator(
      `button[type="submit"][data-tracking="btn-step-${stepNumber}"]`,
      { hasText: 'Next'}
    )
  }

  get progressStep(): Locator {
    return this.form.locator('[data-form-progress-current-step]');
  }

  get totalSteps(): Locator {
    return this.form.locator('[data-form-progress-total-steps]');
  }

  async currentStepNumber(): Promise<number> {
    return Number((await this.progressStep.innerText()).trim());
  }

  async totalStepsNumber(): Promise<number> {
    return Number((await this.totalSteps.innerText()).trim());
  }

  get inputEmail(): Locator {
    return this.form.getByRole('textbox', { name: 'Enter Your Email' });
  }

  get inputPhone(): Locator {
    return this.form.getByRole('textbox', { name: '(XXX)XXX-XXXX' });
  }

  /** Email capture shown on the out-of-area ("sorry") panel. */
  get inputNotifyEmail(): Locator {
    return this.form.getByRole('textbox', { name: 'Email Address' });
  }

  get stepHeading(): Locator {
    return this.activeStep().locator('.stepTitle__hdr');
  }

  get sorryPanel(): Locator {
    return this.container.locator('.steps.step-sorry');
  }

  /** Inline validation message within the active step, if any. */
  get errorMessage(): Locator {
    return this.activeStep().locator('.error, .invalid-feedback, [class*="error"], [role="alert"]');
  }

  // --- actions ---

  async enterZipCode(zip: string): Promise<void> {
    await this.inputZipCode.fill(zip);
  }

  async selectInterest(label: string): Promise<void> {
    await this.activeStep().getByText(label, { exact: true }).click();
  }

  async selectProperty(label: string): Promise<void> {
    await this.activeStep().getByText(label, { exact: true }).click();
  }

  async fillName(name: string): Promise<void> {
    await this.inputName.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.inputEmail.fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.inputPhone.fill(phone);
  }

  async fillNotifyEmail(email: string): Promise<void> {
    await this.inputNotifyEmail.fill(email);
  }

  async proceed({ toStep }: { toStep : number }): Promise<void> {
    await this.buttonNext(toStep - 1).click();
  }
}
