import { Component } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-benefits',
  imports: [Animation],
  templateUrl: './benefits.html',
  styleUrl: './benefits.scss',
})
export class Benefits {
  protected readonly benefits = [
    {
      icon: 'cog',
      title: 'Automação e padronização',
      description: 'Reduza tarefas manuais e garanta processos consistentes em toda a operação.',
    },
    {
      icon: 'bar-chart-3',
      title: 'Visão em tempo real',
      description: 'Dashboards e relatórios que mostram o que está­ acontecendo agora.',
    },
    {
      icon: 'link-2',
      title: 'Integrações nativas',
      description: 'Conecte ERP, CRM, WhatsApp e e-mail sem dor de cabeça.',
    },
    {
      icon: 'shield',
      title: 'Segurança e permissões',
      description: 'Controle quem vê e edita cada informação com níveis de acesso.',
    },
    {
      icon: 'clock',
      title: 'Implantação rá­pida',
      description: 'Go-live em até 14 dias com acompanhamento dedicado.',
    },
    {
      icon: 'users',
      title: 'Gestão de projetos dedicada',
      description: 'Um gestor acompanha sua implantação do início ao fim.',
    },
  ];
}
