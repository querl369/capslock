import { QuizForm } from '../pages/quiz.form';
import { ZIP, INTEREST, PROPERTY, CONTACT } from '../data/test-data';

/**
 * Reusable navigation flows composed from QuizForm actions.
 * They move the form to a given step so each validation test can start from there
 * without duplicating the lead-in. They contain no assertions.
 */

/** Step 1 → Step 2 using a serviced ZIP. */
export async function advanceToInterest(quiz: QuizForm): Promise<void> {
  await quiz.enterZip(ZIP.available);
  await quiz.submitZipAndAwaitResult();
}

/** Step 1 → Step 3 (property). */
export async function advanceToProperty(quiz: QuizForm): Promise<void> {
  await advanceToInterest(quiz);
  await quiz.selectInterest(INTEREST.safety);
  await quiz.proceed();
}

/** Step 1 → Step 4 (contact). */
export async function advanceToContact(quiz: QuizForm): Promise<void> {
  await advanceToProperty(quiz);
  await quiz.selectProperty(PROPERTY.owned);
  await quiz.proceed();
}

/** Step 1 → Step 5 (phone). */
export async function advanceToPhone(quiz: QuizForm): Promise<void> {
  await advanceToContact(quiz);
  await quiz.fillName(CONTACT.validName);
  await quiz.fillEmail(CONTACT.validEmail);
  await quiz.proceed();
}
