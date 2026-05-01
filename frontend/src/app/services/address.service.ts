import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Address, AddressDto, AddressForm } from '../models/address.type';
import { ConfirmService } from './confirm.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { isAddressDto } from '../guards/addressType.guard';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  confirmService = inject(ConfirmService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  baseUrl = environment.apiUrl + 'addresses';
  http = inject(HttpClient);
  guestAddress = signal<AddressForm | null>(null);
  private _addresses = signal<Address[]>([]);
  readonly addresses = this._addresses.asReadonly();
  readonly billingAddress = computed(
    () => this.addresses().find((a: Address) => a.type === 'BILLING') ?? null,
  );
  loading = signal(false);

  loadAddresses() {
    if (this.authService.isLoggedIn()) {
      return this.http.get<Address[]>(this.baseUrl, { withCredentials: true }).pipe(
        tap((addresses: Address[]) => {
          this._addresses.set(addresses);
        }),
        catchError((err) => {
          this.notificationService.error('Could not load addresses');
          return throwError(() => err);
        }),
      );
    } else {
      const guestAddress = this.getGuestAddress();
      this.saveGuestAddress(guestAddress);
      return of([guestAddress]);
    }
  }

  addAddress(address: AddressDto) {
    if (!this.authService.isLoggedIn()) {
      const id = Math.round(Math.random() * 100);
      const saveAddress = {
        id: id,
        ...address,
      };
      this.saveGuestAddress(saveAddress);
      this.guestAddress.set(saveAddress);
    }
    this.http
      .post<Address>(this.baseUrl, address, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loadAddresses();
          this.notificationService.success('Address added');
        }),
        catchError((err) => {
          this.notificationService.error('Could not add address');
          return throwError(() => err);
        })
      ).subscribe();
  }

  getGuestAddress(): Address | null {
    const guestAddress = localStorage.getItem('guestAddress');
    if (guestAddress) {
      try {
        const json = JSON.parse(guestAddress);
        const result = isAddressDto(json);
        if (result.isAddressDto) {
          return result.object;
        }
        throw new Error('Invalid format');
      } catch {
        this.notificationService.warning('Could not parse address data', 'Invalid format');
        return null;
      }
    }
    return null;
  }

  saveGuestAddress(address: AddressForm | null) {
    if (address == null) return localStorage.removeItem('guestAddress');
    localStorage.setItem('guestAddress', JSON.stringify(address));
  }

  changeAddress(address: AddressForm) {
    if (!this.authService.isLoggedIn()) {
      return this.saveGuestAddress(address);
    }
    this.http
      .put<Address>(this.baseUrl + '/' + address.id, address, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loadAddresses();
          this.notificationService.success('Address updated');
        }),
        catchError((err) => {
          this.notificationService.error('Could not update address');
          return throwError(() => err);
        })
      );
  }

  async deleteAddress(addressId: number) {
    if (!this.authService.isLoggedIn()) {
      return this.notificationService.warning('Cannot delete address');
    }
    const address = this.addresses().find((a: Address) => a.id === addressId);
    if (address == undefined) return this.notificationService.warning('Address not found');

    const confirmed = await this.confirmService.confirm({
      title: 'Delete address',
      message: 'Are you sure you want to delete this address?',
    });
    if (!confirmed) return;

    if (address.type === 'BILLING') {
      return this.notificationService.warning('Cannot delete billing address');
    }
    return this.http
      .delete<Address>(this.baseUrl + '/' + addressId, { withCredentials: true })
      .subscribe(() => {
        this.loadAddresses();
        this.notificationService.success('Address deleted');
      });
  }
}
