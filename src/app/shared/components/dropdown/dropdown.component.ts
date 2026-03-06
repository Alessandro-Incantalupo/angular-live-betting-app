import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T> {
  private elementRef = inject(ElementRef);

  options = input.required<T[]>();
  selected = input<T | null>(null);
  placeholder = input<string>('Select an option...');
  labelKey = input<keyof T | ''>(''); // If objects, which key to display. If strings, empty.

  selectionChange = output<T>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  selectOption(opt: T) {
    this.selectionChange.emit(opt);
    this.isOpen.set(false);
  }

  getDisplayLabel(opt: T | null): string {
    if (!opt) return this.placeholder();
    const key = this.labelKey();
    if (key && typeof opt === 'object') {
      return String(opt[key]);
    }
    return String(opt);
  }

  // Close dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
