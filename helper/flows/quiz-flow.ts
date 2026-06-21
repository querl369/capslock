import { QuizForm } from '../pages/quiz.form';
import { ZIP, INTEREST, PROPERTY, CONTACT, STEP } from '../data/test-data';

// Navigation-only helpers that drive the funnel to a given step so tests skip the lead-in.

export async function advanceToInterest(quiz: QuizForm): Promise<void> {
  await quiz.enterZip(ZIP.available);
  await quiz.submitStep(STEP.zip);
}

export async function advanceToProperty(quiz: QuizForm): Promise<void> {
  await advanceToInterest(quiz);
  await quiz.chooseInterest(INTEREST.safety);
  await quiz.submitStep(STEP.interest);
}

export async function advanceToContact(quiz: QuizForm): Promise<void> {
  await advanceToProperty(quiz);
  await quiz.chooseProperty(PROPERTY.owned);
  await quiz.submitStep(STEP.property);
}

export async function advanceToPhone(quiz: QuizForm): Promise<void> {
  await advanceToContact(quiz);
  await quiz.fillName(CONTACT.validName);
  await quiz.fillEmail(CONTACT.validEmail);
  await quiz.submitStep(STEP.contact);
}
