import { Injectable, signal } from '@angular/core';

export interface ContactFormValue {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormState extends ContactFormValue {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

const INITIAL_STATE: ContactFormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
  submitting: false,
  submitted: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  private readonly stateSignal = signal<ContactFormState>(INITIAL_STATE);

  readonly state = this.stateSignal.asReadonly();

  updateField<K extends keyof ContactFormValue>(field: K, value: ContactFormValue[K]): void {
    this.stateSignal.update((current) => ({ ...current, [field]: value, error: null }));
  }

  async submit(): Promise<boolean> {
    const state = this.stateSignal();
    const validationError = this.validate(state);

    if (validationError) {
      this.stateSignal.update((current) => ({ ...current, error: validationError }));
      return false;
    }

    this.stateSignal.update((current) => ({ ...current, submitting: true, error: null }));
    await this.simulateRequest();

    this.stateSignal.set({
      ...INITIAL_STATE,
      submitted: true,
    });

    return true;
  }

  reset(): void {
    this.stateSignal.set(INITIAL_STATE);
  }

  private validate(state: ContactFormState): string | null {
    if (!state.name.trim()) {
      return 'Name is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      return 'Enter a valid email address.';
    }

    if (!state.subject.trim()) {
      return 'Subject is required.';
    }

    if (!state.message.trim()) {
      return 'Message is required.';
    }

    if (state.phone.trim() && !/^[\d\s+().-]{7,}$/.test(state.phone.trim())) {
      return 'Enter a valid phone number.';
    }

    return null;
  }

  private simulateRequest(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 800);
    });
  }
}
