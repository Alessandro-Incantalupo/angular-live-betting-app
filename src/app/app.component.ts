import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

function isImgEl(el: HTMLElement): el is HTMLImageElement {
  return el.nodeName.toUpperCase() === 'IMG';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'betting-hiring';
  @HostListener('click', ['$event.target'])
  openLink(target: HTMLElement) {
    if (!isImgEl(target)) return;

    window.open(target.src, '_blank');
  }
}
