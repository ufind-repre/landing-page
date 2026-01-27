import { Component, HostListener, signal } from '@angular/core';
import { email, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { Animation } from '../../../directives/animation/animation';

type ContactForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  objective: string;
  message: string;
};

@Component({
  selector: 'app-contact',
  imports: [Animation, FormField],
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

  protected readonly formModel = signal<ContactForm>({
    name: '',
    company: '',
    email: '',
    phone: '',
    objective: '',
    message: '',
  });

  protected readonly form = form(this.formModel, (schema) => {
    validate(schema.name, ({ value }) => {
      const name = value().trim();
      if (name.length < 2) return { kind: 'name', message: 'Informe seu nome.' };
      return null;
    });
    validate(schema.company, ({ value }) => {
      const company = value().trim();
      if (company.length < 2) return { kind: 'company', message: 'Informe a empresa.' };
      return null;
    });
    required(schema.email, { message: 'Informe seu e-mail.' });
    email(schema.email, { message: 'E-mail invalido.' });
    validate(schema.phone, ({ value }) => {
      const digits = value().replace(/\D/g, '');
      if (digits.length < 10) return { kind: 'phone', message: 'Informe um telefone valido.' };
      return null;
    });
  });

  protected readonly isSubmitted = signal(false);
  protected readonly isObjectiveOpen = signal(false);
  protected readonly toast = signal({
    show: false,
    title: '',
    description: '',
  });
  private readonly phoneDigits = signal('');

  protected async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.form, async () => {
      const payload = this.serializeForm();
      const emailPayload = this.buildEmailPayload(payload);

      try {
        const response = await fetch('https://ufind-vercel.vercel.app/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) throw new Error('Erro ao enviar.');

        this.isSubmitted.set(true);
        this.showToast('Mensagem enviada!', 'Retornaremos em ate 1 dia util.');
        this.formModel.set({
          name: '',
          company: '',
          email: '',
          phone: '',
          objective: '',
          message: '',
        });
        this.phoneDigits.set('');
      } catch {
        this.showToast('Falha no envio', 'Tente novamente em instantes.');
      }

      return undefined;
    });

    if (this.form().invalid()) {
      this.showToast('Revise os campos', 'Preencha os dados obrigatorios corretamente.');
    }
  }

  protected handleEmailInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.form.email().value.set(this.normalizeEmail(value));
  }

  protected handlePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputEvent = event as InputEvent;
    const rawDigits = input.value.replace(/\D/g, '');
    const hasPrefix = input.value.trim().startsWith('+') || rawDigits.length > 11;
    let digits = rawDigits;

    if (inputEvent?.inputType == 'deleteContentBackward' && digits == this.phoneDigits())
      digits = digits.slice(0, -1);

    this.phoneDigits.set(digits);
    const formatted = this.formatPhone(digits, hasPrefix);
    input.value = formatted;
    this.form.phone().value.set(formatted);
  }

  protected selectObjective(value: string, event: MouseEvent): void {
    event.stopPropagation();
    this.form.objective().value.set(value);
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

  private normalizeEmail(value: string): string {
    return value.replace(/\s+/g, '').toLowerCase();
  }

  private formatPhone(value: string, hasPrefix = false): string {
    const digits = value.replace(/\D/g, '');
    const formatLocal = (local: string): string => {
      const localDigits = local.slice(0, 11);
      if (localDigits.length <= 10)
        return localDigits.replace(
          /^(\d{0,2})(\d{0,4})(\d{0,4}).*$/,
          (_match, ddd, part1, part2) => {
            const area = ddd ? `( ${ddd}` + (ddd.length === 2 ? ' ) ' : '') : '';
            const mid = part1 ? part1 + (part2 ? '-' : '') : '';
            return `${area}${mid}${part2}`;
          },
        );

      return localDigits.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*$/, (_match, ddd, part1, part2) => {
        const area = ddd ? `( ${ddd}` + (ddd.length === 2 ? ' ) ' : '') : '';
        const mid = part1 ? part1 + (part2 ? '-' : '') : '';
        return `${area}${mid}${part2}`;
      });
    };

    if (!hasPrefix) return formatLocal(digits);

    if (digits.length > 11 && digits.length <= 13)
      return `+${digits.slice(0, 2)} ${formatLocal(digits.slice(2))}`;

    if (digits.length <= 3) return `+${digits}`;

    const maxLocal11 = Math.min(11, digits.length);
    const countryLen11 = digits.length - maxLocal11;
    if (countryLen11 >= 1 && countryLen11 <= 3)
      return `+${digits.slice(0, countryLen11)} ${formatLocal(digits.slice(countryLen11))}`;

    const maxLocal10 = Math.min(10, digits.length);
    const countryLen10 = digits.length - maxLocal10;
    if (countryLen10 >= 1 && countryLen10 <= 3)
      return `+${digits.slice(0, countryLen10)} ${formatLocal(digits.slice(countryLen10))}`;

    const fallbackCountryLen = Math.min(3, Math.max(1, digits.length - 10));
    const fallbackCountry = digits.slice(0, fallbackCountryLen);
    const fallbackLocal = digits.slice(fallbackCountryLen);
    return fallbackLocal
      ? `+${fallbackCountry} ${formatLocal(fallbackLocal)}`
      : `+${fallbackCountry}`;
  }

  private serializeForm(): ContactForm {
    const data = this.formModel();
    return {
      name: data.name.trim(),
      company: data.company.trim(),
      email: this.normalizeEmail(data.email),
      phone: data.phone.replace(/\D/g, ''),
      objective: data.objective,
      message: data.message.trim(),
    };
  }

  private buildEmailPayload(data: ContactForm): Record<string, string> {
    const objective = data.objective || 'Não informado';
    const message = data.message || 'Não informada';
    const safe = (value: string) => this.escapeHtml(value);

    return {
      subject: `Novo contato - ${data.name}`,
      text: [
        `Nome: ${data.name}`,
        `Empresa: ${data.company}`,
        `E-mail: ${data.email}`,
        `Telefone: ${data.phone}`,
        `Objetivo: ${objective}`,
        `Mensagem: ${message}`,
      ].join('\n'),
      html: [
        `<p><strong>Nome:</strong> ${safe(data.name)}</p>`,
        `<p><strong>Empresa:</strong> ${safe(data.company)}</p>`,
        `<p><strong>E-mail:</strong> ${safe(data.email)}</p>`,
        `<p><strong>Telefone:</strong> ${safe(data.phone)}</p>`,
        `<p><strong>Objetivo:</strong> ${safe(objective)}</p>`,
        `<p><strong>Mensagem:</strong> ${safe(message)}</p>`,
      ].join(''),
      replyTo: data.email,
    };
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
