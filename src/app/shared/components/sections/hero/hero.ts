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
    { icon: 'trending-up', value: '+30%', label: 'ganho de eficiência (média)' },
    { icon: 'zap', value: 'de 7 à 14 dias', label: 'para ativar e treinar' },
  ];
}
