import { Component, computed, HostListener, signal } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

type ContactForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  objective: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

@Component({
  selector: 'app-contact',
  imports: [Animation],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly objectives = [
    'Organizar dados e processos',
    'Reduzir retrabalho',
    'Integrar sistemas',
    'Automatizar tarefas',
    'Outro',
  ];

  protected readonly form = signal<ContactForm>({
    name: '',
    company: '',
    email: '',
    phone: '',
    objective: '',
    message: '',
  });

  protected readonly formErrors = computed(() => this.validateForm(this.form()));
  protected readonly isFormValid = computed(() => Object.keys(this.formErrors()).length === 0);

  protected readonly isSubmitting = signal(false);
  protected readonly isSubmitted = signal(false);
  protected readonly isObjectiveOpen = signal(false);
  protected readonly submitAttempted = signal(false);
  protected readonly touched = signal<Partial<Record<keyof ContactForm, boolean>>>({});
  protected readonly toast = signal({
    show: false,
    title: '',
    description: '',
  });

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.isSubmitting()) return;

    this.submitAttempted.set(true);
    if (!this.isFormValid())
      return this.showToast('Revise os campos', 'Preencha os dados obrigatórios corretamente.');

    this.isSubmitting.set(true);
    const payload = this.serializeForm();

    try {
      const response = await fetch('https://formsubmit.co/6bdf30e4ce769a7d77ea111ecc3948ca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams(payload),
      });

      if (!response.ok) throw new Error('Erro ao enviar.');

      this.isSubmitted.set(true);
      this.showToast('Mensagem enviada!', 'Retornaremos em ate 1 dia util.');
      this.form.set({
        name: '',
        company: '',
        email: '',
        phone: '',
        objective: '',
        message: '',
      });
    } catch {
      this.showToast('Falha no envio', 'Tente novamente em instantes.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected updateTextField(field: keyof ContactForm, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateField(field, value);
    this.markTouched(field);
  }

  protected handleEmailInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateField('email', this.normalizeEmail(value));
    this.markTouched('email');
  }

  protected handlePhoneInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateField('phone', this.formatPhone(value));
    this.markTouched('phone');
  }

  protected selectObjective(value: string, event: MouseEvent): void {
    event.stopPropagation();
    this.updateField('objective', value);
    this.isObjectiveOpen.set(false);
  }

  protected toggleObjective(event: MouseEvent): void {
    event.stopPropagation();
    this.isObjectiveOpen.set(!this.isObjectiveOpen());
  }

  @HostListener('document:click')
  protected handleDocumentClick(): void {
    this.isObjectiveOpen.set(false);
  }

  protected showToast(title: string, description: string): void {
    this.toast.set({ show: true, title, description });
    setTimeout(() => this.toast.set({ show: false, title: '', description: '' }), 3000);
  }

  protected showFieldError(field: keyof ContactForm): boolean {
    return Boolean(this.submitAttempted() || this.touched()[field]);
  }

  private updateField(field: keyof ContactForm, value: string): void {
    this.form.update((current) => ({ ...current, [field]: value }));
  }

  private markTouched(field: keyof ContactForm): void {
    this.touched.update((current) => ({ ...current, [field]: true }));
  }

  private validateForm(data: ContactForm): ContactErrors {
    const errors: ContactErrors = {};
    const name = data.name.trim();
    const company = data.company.trim();
    const email = this.normalizeEmail(data.email);
    const phoneDigits = data.phone.replace(/\D/g, '');

    if (name.length < 2) errors.name = 'Informe seu nome.';
    if (company.length < 2) errors.company = 'Informe a empresa.';

    if (!email) {
      errors.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'E-mail invalido.';
    }

    if (phoneDigits.length < 10) {
      errors.phone = 'Informe um telefone valido.';
    }

    return errors;
  }

  private normalizeEmail(value: string): string {
    return value.replace(/\s+/g, '').toLowerCase();
  }

  private formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*$/, (_match, ddd, part1, part2) => {
        const area = ddd ? `(${ddd}` + (ddd.length === 2 ? ') ' : '') : '';
        const mid = part1 ? part1 + (part2 ? '-' : '') : '';
        return `${area}${mid}${part2}`;
      });
    }

    return digits.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*$/, (_match, ddd, part1, part2) => {
      const area = ddd ? `(${ddd}` + (ddd.length === 2 ? ') ' : '') : '';
      const mid = part1 ? part1 + (part2 ? '-' : '') : '';
      return `${area}${mid}${part2}`;
    });
  }

  private serializeForm(): Record<string, string> {
    const data = this.form();
    return {
      name: data.name.trim(),
      company: data.company.trim(),
      email: this.normalizeEmail(data.email),
      phone: data.phone.replace(/\D/g, ''),
      objective: data.objective,
      message: data.message.trim(),
    };
  }
}
