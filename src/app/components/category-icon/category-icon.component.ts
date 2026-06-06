import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import {
  CATEGORY_ICON_MAP, CATEGORY_COLOR_MAP, CATEGORY_BG_MAP,
  DEFAULT_ICON, DEFAULT_COLOR, DEFAULT_BG,
} from '../../core/pipes/category.constants';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <div class="cat-icon-host" [style.width.px]="size" [style.height.px]="size"
         [style.background]="bg" [style.border-radius.px]="size * 0.25">
      <ion-icon [name]="icon" [style.color]="color" [style.font-size.px]="size * 0.5"></ion-icon>
    </div>
  `,
  styles: [`
    .cat-icon-host {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `],
})
export class CategoryIconComponent {
  @Input() categoria?: string | null;
  @Input() size = 40;

  get icon():  string { return (this.categoria && CATEGORY_ICON_MAP[this.categoria]) ?? DEFAULT_ICON;  }
  get color(): string { return (this.categoria && CATEGORY_COLOR_MAP[this.categoria]) ?? DEFAULT_COLOR; }
  get bg():    string { return (this.categoria && CATEGORY_BG_MAP[this.categoria])    ?? DEFAULT_BG;    }
}
