import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY_ICON_MAP, DEFAULT_ICON } from './category.constants';

@Pipe({ name: 'categoryIcon', standalone: true, pure: true })
export class CategoryIconPipe implements PipeTransform {
  transform(cat?: string | null): string {
    return (cat && CATEGORY_ICON_MAP[cat]) ?? DEFAULT_ICON;
  }
}
