import { Component } from '@angular/core';
import { Animation } from '../../../directives/animation/animation';

@Component({
  selector: 'app-hero',
  imports: [Animation],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly stats = [
    { icon: 'trending-up', value: '+30%', label: 'GANHO DE EFICIÊNCIA MÉDIA' },
    { icon: 'zap', value: 'DE 7 A 14 dias', label: 'PARA ATIVAR E TREINAR' },
  ];
}
