import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./badge.component.less'],
  host: {
    '[class]': 'variant()',
    '[class.inverse]': 'inverse()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  variant = input<'sport' | 'category' | 'default'>('default');
  inverse = input<boolean>(false);
}
