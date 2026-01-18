import { Component } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-testimonials',
  imports: [Animation],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  protected readonly testimonials = [
    {
      quote:
        'Implantação rá­pida e organizada. Em duas semanas já está­vamos operando com tudo integrado.',
      author: 'Carlos M.',
      role: 'Diretor de Operações',
      company: 'Logística Express',
      quoteIcon: '/icons/quote-blue-cyan.svg',
    },
    {
      quote:
        'Paramos de ter retrabalho com planilhas. Agora temos visão em tempo real de toda a operação.',
      author: 'Ana Paula S.',
      role: 'Gerente Comercial',
      company: 'Distribuidora Norte',
      quoteIcon: '/icons/quote-violet-purple.svg',
    },
    {
      quote:
        'A consultoria antes da venda fez diferença. Escolhemos exatamente o que precisávamos.',
      author: 'Roberto L.',
      role: 'CEO',
      company: 'TechServ Solutions',
      quoteIcon: '/icons/quote-emerald-teal.svg',
    },
  ];
}
