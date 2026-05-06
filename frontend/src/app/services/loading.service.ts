import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoadingHome = signal(false);
  isLoadingUserData = signal(false);

  startLoading(state: 'home' | 'user') {
    if (state == 'home') {
      this.isLoadingHome.set(true);
    } else {
      this.isLoadingUserData.set(true);
    }
  }

  stopLoading(state: 'home' | 'user') {
    if (state == 'home') {
      this.isLoadingHome.set(false);
    } else {
      this.isLoadingUserData.set(false);
    }
  }
}
