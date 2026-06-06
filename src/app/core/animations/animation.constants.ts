// Shared easing curves — single source of truth for JS animations.
// CSS equivalents live in src/theme/_animations.scss as custom properties.

export const EASING = {
  spring:       'cubic-bezier(0.16, 1, 0.3, 1)',
  springBounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeIn:       'cubic-bezier(0.4, 0, 1, 1)',
  easeOut:      'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

export const DURATION = {
  fast:    150,
  normal:  280,
  spring:  320,
  leave:   190,
} as const;
