import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private toastr = inject(ToastrService);

  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title);
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title);
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(message, title);
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title);
  }

  toBeImplemented(
    message: string = 'This feature has not yet been implemented',
    title: string = 'To be implemented',
  ) {
    this.toastr.warning(message, title, {});
  }

  pending(message: string, title: string = 'Pending') {
    const toast = this.toastr.info(message, title, {
      toastClass: 'ngx-toastr toast-pending',
      disableTimeOut: true,
    });
    return toast.toastId;
  }

  clear(toastId: number) {
    this.toastr.remove(toastId);
  }
}
