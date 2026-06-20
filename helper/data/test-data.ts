/**
 * Centralised test data — defined once and reused across specs and page objects.
 */

export const ZIP = {
  /** Serviced area — drives the full happy-path funnel. */
  available: '68901',
  /** Out-of-area — routes to the "sorry" notify-me branch. */
  outOfArea: '11111',
  /** Malformed values used by ZIP validation tests. */
  tooShort: '123',
  nonNumeric: 'abcde',
} as const;

export const CONTACT = {
  validName: 'John Smith',
  /** Single-word name: valid per spec, but the site silently requires a full name (defect). */
  singleWordName: 'John',
  validEmail: 'john.smith@example.com',
  validPhone: '5551234567',
} as const;

export const INVALID_EMAIL = {
  noAt: 'john.smith',
  noDomain: 'john@',
} as const;

export const INVALID_PHONE = {
  tooFewDigits: '12345',
  nonNumeric: 'abcdefghij',
} as const;

export const INTEREST = {
  independence: 'Independence',
  safety: 'Safety',
  therapy: 'Therapy',
  other: 'Other',
} as const;

export const PROPERTY = {
  owned: 'Owned House / Condo',
  rental: 'Rental Property',
  mobile: 'Mobile Home',
} as const;

/** Total number of steps advertised by the form's progress indicator. */
export const TOTAL_STEPS = 5;
