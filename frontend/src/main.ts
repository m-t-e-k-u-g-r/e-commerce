import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeGB from '@angular/common/locales/en-GB';

registerLocaleData(localeGB);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
