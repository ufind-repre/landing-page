import { Component, signal } from '@angular/core';
import { Animation } from '../../shared/directives/animation/animation';
import { Hero } from '../../shared/components/sections/hero/hero';
import { Solution } from '../../shared/components/sections/solution/solution';
import { Benefits } from '../../shared/components/sections/benefits/benefits';
import { HowItWorks } from '../../shared/components/sections/how-it-works/how-it-works';
import { Testimonials } from '../../shared/components/sections/testimonials/testimonials';
import { Faq } from '../../shared/components/sections/faq/faq';
import { Contact } from '../../shared/components/sections/contact/contact';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-landing-page',
  imports: [Animation, Hero, Solution, Benefits, HowItWorks, Testimonials, Faq, Contact, Footer],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  protected readonly navLinks = [
    { href: '#solution', label: 'Solução' },
    { href: '#benefits', label: 'Benefícios' },
    { href: '#how-it-works', label: 'Como funciona' },
    { href: '#testimonials', label: 'Depoimentos' },
    { href: '#faq', label: 'FAQ' },
  ];

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((prev) => !prev);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
