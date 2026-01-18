import { Component } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-solution',
  imports: [Animation],
  templateUrl: './solution.html',
  styleUrl: './solution.scss',
})
export class Solution {
  protected readonly solutions = [
    {
      icon: 'search',
      title: 'Diagnóstico',
      description:
        'Mapeio rotinas, gargalos e integrações. Você recebe um plano claro de melhoria.',
    },
    {
      icon: 'rocket',
      title: 'Implantação guiada',
      description: 'Configuração, migração e treinamento para colocar a equipe rodando rá­pido.',
    },
    {
      icon: 'headphones',
      title: 'Suporte e evolução',
      description: 'Acompanhamento pós go-live para ajustes e evolução contínua.',
    },
  ];
}
