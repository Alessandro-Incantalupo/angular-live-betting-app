import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { MOCK_API_OPTIONS, mockApiInterceptor } from './core/mock-api/mock-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    // The mock answers `/api/*` in the browser. For a real backend, drop the interceptor and
    // provide API_BASE_URL with its address.
    provideHttpClient(withFetch(), withInterceptors([mockApiInterceptor])),
    {
      provide: MOCK_API_OPTIONS,
      useFactory: () => ({
        latencyMs: [150, 450],
        // `?flaky` in the address makes a third of the requests fail, to show the error states.
        failureRate: new URLSearchParams(inject(DOCUMENT).location.search).has('flaky') ? 0.35 : 0,
        now: Date.now,
        simulator: {},
      }),
    },
  ],
};
