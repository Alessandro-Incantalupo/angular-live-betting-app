import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="layout-container">
      <header class="app-header">
        <h1>Betting Hiring Application</h1>
      </header>

      <main class="app-content">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrls: ['./layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {}
