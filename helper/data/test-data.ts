export const ZIP = {
  /** Serviced area; routes to the full quiz funnel. */
  available: '68901',
  /** Out-of-area; routes to the "sorry" notify-me branch. */
  outOfArea: '11111',
  tooShort: '123',
  nonNumeric: 'abcde',
} as const;

export const CONTACT = {
  validName: 'John Smith',
  /** The site rejects a single name, demanding first + last (defect). */
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

/** Quiz step numbers, named for readability (they map to `.step-N` / `btn-step-N`). */
export const STEP = {
  zip: 1,
  interest: 2,
  property: 3,
  contact: 4,
  phone: 5,
} as const;
