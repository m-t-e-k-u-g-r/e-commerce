import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
      maxOpened: 3,
      autoDismiss: true,
      progressBar: true,
      newestOnTop: true
    }),
  ]
};
