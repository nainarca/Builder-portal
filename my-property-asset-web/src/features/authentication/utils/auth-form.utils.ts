import { FormGroup } from '@angular/forms';

import { ValidationIssue } from '@shared/ui/models';

export function collectValidationIssues(
  form: FormGroup,
  labels: Record<string, string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  Object.entries(form.controls).forEach(([key, control]) => {
    if (!control.invalid) {
      return;
    }

    const label = labels[key] ?? key;
    if (control.hasError('required')) {
      issues.push({ field: key, message: `${label} is required.` });
      return;
    }

    if (control.hasError('email') || control.hasError('pattern')) {
      issues.push({ field: key, message: `${label} must be a valid email address.` });
      return;
    }

    if (control.hasError('minlength')) {
      const required = control.getError('minlength')?.requiredLength;
      issues.push({ field: key, message: `${label} must be at least ${required} characters.` });
    }
  });

  return issues;
}
