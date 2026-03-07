import { Pipe, PipeTransform } from '@angular/core';
import { slugify } from '../utils/string.utils';

@Pipe({
  name: 'slugify',
  standalone: true,
})
export class SlugifyPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return slugify(value);
  }
}
