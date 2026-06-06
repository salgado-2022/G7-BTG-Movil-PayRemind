import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'categoryClass', standalone: true, pure: true })
export class CategoryClassPipe implements PipeTransform {
  /** Returns the cat-xxx CSS class token. Compose with a base class in templates:
   *  [class]="'icon-wrap ' + (reminder.categoria | categoryClass)"
   */
  transform(cat?: string | null): string {
    return 'cat-' + (cat?.toLowerCase() ?? 'default');
  }
}
