import { Locator, Page } from '@playwright/test';

export class QuizForm {
  readonly page: Page;
  readonly form: Locator;
  readonly inputZipCode: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#form-container-1');
    this.inputZipCode = this.form.getByRole('textbox', { name: 'Enter ZIP Code' });
  }

  buttonNext(stepNumber: number) {
    return this.form.locator(
      `button[type="submit"][data-tracking="btn-step-${stepNumber}"]`,
      { hasText: 'Next'}
    )
  }

  get progressStep(): Locator {
    return this.form.locator('[data-form-progress-current-step]');
  }

  async currentStepNumber(): Promise<number> {
    return Number((await this.progressStep.innerText()).trim());
  }

  get nameInput(): Locator {
    return this.activeStep().getByRole('textbox', { name: 'Enter Your Name' });
  }

  get emailInput(): Locator {
    return this.activeStep().getByRole('textbox', { name: 'Enter Your Email' });
  }

  get phoneInput(): Locator {
    return this.activeStep().getByRole('textbox', { name: '(XXX)XXX-XXXX' });
  }

  /** Email capture shown on the out-of-area ("sorry") panel. */
  get notifyEmailInput(): Locator {
    return this.activeStep().getByRole('textbox', { name: 'Email Address' });
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



  async activeStepClass(): Promise<string> {
    return (await this.activeStep().getAttribute('class')) ?? '';
  }

  // --- actions ---

  async enterZip(zip: string): Promise<void> {
    await this.zipInput.fill(zip);
  }

  async selectInterest(label: string): Promise<void> {
    await this.activeStep().getByText(label, { exact: true }).click();
  }

  async selectProperty(label: string): Promise<void> {
    await this.activeStep().getByText(label, { exact: true }).click();
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

  async fillNotifyEmail(email: string): Promise<void> {
    await this.notifyEmailInput.fill(email);
  }

  /** Click the active step's primary button to advance to the next step. */
  async proceed(): Promise<void> {
    await this.activeStep().locator('button[type="submit"]').click();
  }

  /**
   * Submit the ZIP step and wait for the availability check to resolve.
   * The lookup is asynchronous (a ~6s progress spinner), so we wait for the resulting
   * panel — serviced (step-2) or out-of-area (step-sorry) — instead of a fixed delay.
   */
  async submitZipAndAwaitResult(): Promise<void> {
    await this.proceed();
    await this.container
      .locator('.steps.step-2, .steps.step-sorry')
      .filter({ visible: true })
      .first()
      .waitFor({ state: 'visible', timeout: 20_000 });
  }
}
