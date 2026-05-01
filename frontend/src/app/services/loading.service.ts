import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = signal(false);

  startLoading() {
    this.isLoading.set(true);
  }

  stopLoading() {
    this.isLoading.set(false);
  }
}
