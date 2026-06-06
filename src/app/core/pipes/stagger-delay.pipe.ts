import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'staggerDelay', standalone: true, pure: true })
export class StaggerDelayPipe implements PipeTransform {
  /** Returns an animationDelay string for staggered list entrance.
   *  @param index   - position in the list (from @for $index)
   *  @param stepMs  - delay per item in milliseconds (default 55)
   *  @param maxItems - cap so large lists don't delay forever (default 10)
   */
  transform(index: number, stepMs = 55, maxItems = 10): string {
    return `${Math.min(index, maxItems) * stepMs}ms`;
  }
}
