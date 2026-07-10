import { Injectable, signal } from '@angular/core';

export interface NewsletterSubmission {
  email: string;
  submittedAt: number;
}

export interface NewsletterFormState {
  email: string;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class NewsletterFormService {
  private readonly stateSignal = signal<NewsletterFormState>({
    email: '',
    submitting: false,
    submitted: false,
    error: null,
  });

  readonly state = this.stateSignal.asReadonly();

  updateEmail(email: string): void {
    this.stateSignal.update((current) => ({ ...current, email, error: null }));
  }

  async submit(): Promise<boolean> {
    const email = this.stateSignal().email.trim();

    if (!this.isValidEmail(email)) {
      this.stateSignal.update((current) => ({
        ...current,
        error: 'Enter a valid email address.',
      }));
      return false;
    }

    this.stateSignal.update((current) => ({ ...current, submitting: true, error: null }));

    await this.simulateRequest();

    this.stateSignal.set({
      email: '',
      submitting: false,
      submitted: true,
      error: null,
    });

    return true;
  }

  reset(): void {
    this.stateSignal.set({
      email: '',
      submitting: false,
      submitted: false,
      error: null,
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private simulateRequest(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
  }
}
