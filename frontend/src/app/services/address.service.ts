import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Address, AddressDto, AddressForm } from '../models/address.type';
import { ConfirmService } from './confirm.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { isAddressDto } from '../guards/addressType.guard';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  confirmService = inject(ConfirmService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  baseUrl = environment.apiUrl + 'addresses';
  http = inject(HttpClient);
  guestAddress = signal<Address | null>(null);
  private _addresses = signal<Address[]>([]);
  readonly addresses = this._addresses.asReadonly();
  readonly billingAddress = computed(
    () => this.addresses().find((a: Address) => a.type === 'BILLING') ?? null,
  );

  getAddresses() {
    if (this.authService.isLoggedIn()) {
      this.http
        .get<Address[]>(this.baseUrl, { withCredentials: true })
        .subscribe({
          next: (addresses) => this._addresses.set(addresses),
          error: () => this.notificationService.error('Could not load addresses'),
        });
      return;
    }
    this.guestAddress.set(this.getGuestAddress());
    return;
  }

  addAddress(address: AddressDto) {
    if (!this.authService.isLoggedIn()) {
      const id = Math.round(Math.random() * 100);
      const saveAddress = {
        id: id,
        ...address,
      };
      this.saveGuestAddress(saveAddress);
      return this.getGuestAddress();
    }
    return this.http
      .post<Address>(this.baseUrl, address, { withCredentials: true })
      .subscribe(() => {
        this.getAddresses();
        this.notificationService.success('Address added');
      });
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

  saveGuestAddress(address: AddressForm) {
    localStorage.setItem('guestAddress', JSON.stringify(address));
  }

  changeAddress(address: AddressForm) {
    if (!this.authService.isLoggedIn()) {
      return this.saveGuestAddress(address);
    }
    return this.http
      .put<Address>(this.baseUrl + '/' + address.id, address, { withCredentials: true })
      .subscribe(() => {
        this.getAddresses();
        this.notificationService.success('Address updated');
      });
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
        this.getAddresses();
        this.notificationService.success('Address deleted');
      });
  }
}
