import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORY_BG_MAP, DEFAULT_BG } from './category.constants';

@Pipe({ name: 'categoryBg', standalone: true, pure: true })
export class CategoryBgPipe implements PipeTransform {
  transform(cat?: string | null): string {
    return (cat && CATEGORY_BG_MAP[cat]) ?? DEFAULT_BG;
  }
}
