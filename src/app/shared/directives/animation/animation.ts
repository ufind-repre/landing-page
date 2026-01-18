import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Direction = 'down' | 'left' | 'right' | 'fade';

@Directive({
  selector: '[animation]',
  standalone: true,
})
export class Animation implements OnInit, OnDestroy {
  @Input('animation') public direction: Direction = 'down';
  @Input() public revealDelay = 0;

  private observer?: IntersectionObserver;
  private revealTimeout?: ReturnType<typeof setTimeout>;
  private readonly platformId = inject(PLATFORM_ID);
  private isVisible = false;

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly render = inject(Renderer2);

  public ngOnInit(): void {
    const native = this.host.nativeElement;
    this.render.addClass(native, 'reveal');
    this.render.addClass(native, `from-${this.direction}`);

    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;
          const shouldShow = ratio >= 0.03;
          const shouldHide = ratio <= 0.005;

          if (shouldShow && !this.isVisible) {
            const action = (): void => {
              this.render.addClass(native, 'visible');
              this.render.setStyle(native, 'pointer-events', 'auto');
              this.isVisible = true;
            };
            if (this.revealDelay > 0) this.revealTimeout = setTimeout(action, this.revealDelay);
            else action();
          } else if (shouldHide && this.isVisible) {
            if (this.revealTimeout) clearTimeout(this.revealTimeout);
            this.render.removeClass(native, 'visible');
            this.render.setStyle(native, 'pointer-events', 'none');
            this.isVisible = false;
          }
        }),
      { threshold: 0.03, rootMargin: '0px 0px 10% 0px' },
    );
    this.observer.observe(native);
    this.render.setStyle(native, 'pointer-events', 'none');
  }

  public ngOnDestroy(): void {
    if (this.revealTimeout) clearTimeout(this.revealTimeout);
    this.observer?.disconnect();
  }
}
