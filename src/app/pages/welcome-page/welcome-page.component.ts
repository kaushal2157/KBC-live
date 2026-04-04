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

  // Compact acronym row — no boxes needed
  gemsList = [
    { letter: 'G', shortLabel: 'General',  color: 'text-amber-400'   },
    { letter: 'E', shortLabel: 'English',  color: 'text-rose-400'    },
    { letter: 'M', shortLabel: 'Maths',    color: 'text-blue-400'    },
    { letter: 'S', shortLabel: 'Science',  color: 'text-emerald-400' },
  ];


  // Random-ish particles — pre-seeded so they're stable
  // particles = [
  //   { size: 5,  top: 10, left: 8  },
  //   { size: 3,  top: 22, left: 55 },
  //   { size: 6,  top: 38, left: 82 },
  //   { size: 4,  top: 60, left: 20 },
  //   { size: 8,  top: 75, left: 67 },
  //   { size: 3,  top: 88, left: 40 },
  //   { size: 5,  top: 50, left: 92 },
  //   { size: 4,  top: 15, left: 30 },
  //   { size: 6,  top: 45, left: 5  },
  //   { size: 3,  top: 95, left: 77 },
  // ];
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
