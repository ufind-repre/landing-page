import { Component } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-how-it-works',
  imports: [Animation],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorks {
  protected readonly steps = [
    {
      icon: 'message-square',
      step: '01',
      title: 'Entendimento do cenário',
      description: 'Conversamos para mapear suas rotinas, sistemas atuais e principais dores.',
    },
    {
      icon: 'file-text',
      step: '02',
      title: 'Proposta e demonstração',
      description: 'Apresentamos a solução ideal com uma demo focada no seu caso real.',
    },
    {
      icon: 'settings',
      step: '03',
      title: 'Implantação + treinamento',
      description: 'Configuramos tudo, migramos dados e treinamos sua equipe para usar.',
    },
    {
      icon: 'check-circle',
      step: '04',
      title: 'Acompanhamento',
      description: 'Suporte contínuo para ajustes, dúvidas e evolução do sistema.',
    },
  ];
}
