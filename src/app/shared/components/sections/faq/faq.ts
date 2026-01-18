import { Component, signal } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-faq',
  imports: [Animation],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly faqs = [
    {
      question: 'Em quanto tempo meu sistema estará funcionando?',
      answer:
        'O prazo médio é de 7 á 14 dias. Isso inclui configuração, migração de dados e treinamento da equipe. Casos mais complexos podem levar um pouco mais, mas você terá­ um cronograma claro desde o incío.',
    },
    {
      question: 'Você fazem migração de dados?',
      answer:
        'Sim! Migramos seus dados de planilhas, sistemas antigos ou outros softwares. Garantimos que nada se perca na transição e validamos tudo antes do go-live.',
    },
    {
      question: 'Preciso de uma equipe de TI?',
      answer:
        'Não. Cuidamos de toda a parte técnica. Você só precisa de alguém da sua equipe para validar informações e participar do treinamento.',
    },
    {
      question: 'Existe contrato máximo?',
      answer:
        'Trabalhamos com contratos flexíveis. Você pode começar com um período menor para testar e depois decidir se quer continuar. Sem surpresas.',
    },
    {
      question: 'Como funciona o suporte após a implantação?',
      answer:
        'Você terá acesso a suporte por WhatsApp, e-mail e videochamada. Além disso, fazemos acompanhamentos periódicos para garantir que tudo está funcionando bem e identificar melhorias.',
    },
  ];
  protected openFaqIndex = signal(-1);

  protected toggleFaq(index: number): void {
    this.openFaqIndex.update((prev) => (prev == index ? -1 : index));
  }
}
