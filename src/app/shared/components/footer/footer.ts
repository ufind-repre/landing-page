import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Animation } from '../../directives/animation/animation';

@Component({
  selector: 'app-footer',
  imports: [Animation],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly navLinks = [
    { href: '#solution', label: 'Solução' },
    { href: '#benefits', label: 'Benefícios' },
    { href: '#testimonials', label: 'Depoimentos' },
  ];

  private readonly platformId = inject(PLATFORM_ID);

  protected scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
