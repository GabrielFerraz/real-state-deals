import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppStoreModule } from './store/app-store.module';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(AppStoreModule)],
};
