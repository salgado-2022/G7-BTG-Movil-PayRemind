import { createAnimation } from '@ionic/angular';
import type { Animation } from '@ionic/core';
import { DURATION, EASING } from './animation.constants';

export function dialogEnterAnimation(baseEl: HTMLElement): Animation {
  const root = baseEl.shadowRoot!;

  const backdrop = createAnimation()
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0', 'var(--backdrop-opacity, 0.45)');

  const wrapper = createAnimation()
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0.78)' },
      { offset: 1, opacity: '1', transform: 'scale(1)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing(EASING.springBounce)
    .duration(DURATION.spring)
    .addAnimation([backdrop, wrapper]);
}

export function dialogLeaveAnimation(baseEl: HTMLElement): Animation {
  const root = baseEl.shadowRoot!;

  const backdrop = createAnimation()
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', 'var(--backdrop-opacity, 0.45)', '0');

  const wrapper = createAnimation()
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '1', transform: 'scale(1)' },
      { offset: 1, opacity: '0', transform: 'scale(0.82)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing(EASING.easeIn)
    .duration(DURATION.leave)
    .addAnimation([backdrop, wrapper]);
}
