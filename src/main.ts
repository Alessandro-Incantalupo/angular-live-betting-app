import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// --- STANDALONE APPROACH ---
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

// --- MODULE APPROACH ---
// To test this approach, uncomment the lines below and comment out the Standalone Approach above.

// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from './app/app.module';

// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .catch((err) => console.error(err));
