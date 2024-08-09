import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouterModule,
  provideRouter,
  withInMemoryScrolling,
} from '@angular/router';

import { Route } from './app/app.routes';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(
      Route,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    importProvidersFrom(RouterModule.forRoot([...Route])),
    importProvidersFrom(HttpClientModule),
  ],
}).catch((err) => console.error(err));
