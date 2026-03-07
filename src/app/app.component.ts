import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  host: {
    style: 'display: block; height: 100%;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
