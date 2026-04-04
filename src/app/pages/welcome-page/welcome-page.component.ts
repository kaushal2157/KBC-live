import { CommonModule } from '@angular/common';
import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoleContextService } from '../../services/role-context.service';

@Component({
  selector: 'app-welcome-page',
  imports: [CommonModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent implements AfterViewInit, OnDestroy {
  startSound = new Audio('KBC-intro.mp3');
  router          = inject(Router);
  roleContextService = inject(RoleContextService);
  elementRef      = inject(ElementRef);

  branding    = this.roleContextService.getBrandingConfig();
  isTigerTheme = this.roleContextService.getCurrentRole() === 'tiger';
  tagline     = 'Empowering Future Leaders Through Knowledge';

  // Compact acronym row with glass colors
  gemsList = [
    { letter: 'G', shortLabel: 'General',  color: 'text-amber-400',   bgGlow: 'bg-amber-400'   },
    { letter: 'E', shortLabel: 'English',  color: 'text-rose-400',    bgGlow: 'bg-rose-400'    },
    { letter: 'M', shortLabel: 'Maths',    color: 'text-blue-400',    bgGlow: 'bg-blue-400'    },
    { letter: 'S', shortLabel: 'Science',  color: 'text-emerald-400', bgGlow: 'bg-emerald-400' },
  ];


  // Random-ish particles — pre-seeded so they're stable
  particles = Array.from({length: 15}).map(() => ({
    size: Math.random() * 4 + 2, // 2px to 6px
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: Math.random() * 0.5 + 0.3,
    duration: Math.random() * 10 + 10, // 10s to 20s travel
    delay: Math.random() * -20 // random start time
  }));
  private gsapCtx: any;

  async ngAfterViewInit() {
    this.startSound.play();
    if (typeof window === 'undefined') return;

    // ── Lazy-load GSAP ──────────────────────────────────────────────────────
    const { gsap } = await import('gsap');
    const el = this.elementRef.nativeElement;

    this.gsapCtx = gsap.context(() => {

      // ── 0. Set initial invisible states ──────────────────────────────────
      gsap.set([
        '.gsap-bg-glow',
        '.gsap-label',
        '.gsap-logo',
        '.gsap-school-name',
        '.gsap-tagline',
        '.gsap-title',
        '.gsap-gems-row',
        '.gsap-cta',
      ], { autoAlpha: 0 });

      // ── 1. Background glows breathe                              (forever) ─
      gsap.to('.gsap-bg-glow', {
        autoAlpha: 1,
        scale: 1.05,
        duration: 3,
        stagger: 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // ── 2. Main cinematic entrance timeline ──────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.5)' }, delay: 2 });

      // Presented-By label slides down
      tl.to('.gsap-label', { autoAlpha: 1, y: 0, duration: 1.2 });

      // Logo drops with overshoot
      tl.to('.gsap-logo', { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: 'back.out(2)' }, '-=0.5');

      // School name + tagline
      tl.to('.gsap-school-name', { autoAlpha: 1, y: 0, duration: 1.0 }, '-=0.8');
      tl.to('.gsap-tagline',     { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.7');

      // Competition title erupts
      tl.to('.gsap-title', { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: 'back.out(1.3)' }, '-=0.6');

      // Gems acronym row
      tl.to('.gsap-gems-row', { autoAlpha: 1, y: 0, duration: 1.0 }, '-=0.5');

      // CTA button
      tl.to('.gsap-cta', { autoAlpha: 1, y: 0, duration: 1.0 }, '-=0.4');

      // ── 4. Logo flash-aura pulse                                 (forever) ─
      // Starts after entrance is ~done (~8 s)
      gsap.to('.gsap-logo img', {
        filter: 'drop-shadow(0 0 18px rgba(251,191,36,0.9)) drop-shadow(0 0 40px rgba(251,191,36,0.5))',
        duration: 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 8,
      });

    }, el);
  }

  ngOnDestroy() {
    // Safely kills all tweens and resets inline styles for this component
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  startQuiz() {
    this.router.navigate(['contestents-list']);
  }
}
