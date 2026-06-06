import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY_COLOR_MAP, DEFAULT_COLOR } from './category.constants';

@Pipe({ name: 'categoryColor', standalone: true, pure: true })
export class CategoryColorPipe implements PipeTransform {
  transform(cat?: string | null): string {
    return (cat && CATEGORY_COLOR_MAP[cat]) ?? DEFAULT_COLOR;
  }
}
