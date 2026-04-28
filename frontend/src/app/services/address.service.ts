import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Address, AddressDto, AddressForm } from '../models/address.type';
import { ConfirmService } from './confirm.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  confirmService = inject(ConfirmService);
  notificationService = inject(NotificationService);
  baseUrl = environment.apiUrl + 'users/addresses';
  http = inject(HttpClient);
  private _addresses = signal<Address[]>([]);
  readonly addresses = this._addresses.asReadonly();
  readonly billingAddress = computed(() =>
    this.addresses().find((a: Address) => a.type === 'BILLING') ?? null
  );

  getAddresses() {
    return this.http.get<Address[]>(this.baseUrl,
      { withCredentials: true }
    ).subscribe(addresses => {
      this._addresses.set(addresses);
    });
  }

  addAddress(address: AddressDto) {
    return this.http.post<Address>(this.baseUrl, address,
      { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
      this.notificationService.success('Address added');
    });
  }

  changeAddress(address: AddressForm) {
    return this.http.put<Address>(this.baseUrl + '/' + address.id,
      address, { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
      this.notificationService.success('Address updated');
    });
  }

  async deleteAddress(addressId: number) {
    const address = this.addresses().find((a: Address) => a.id === addressId);
    if (address == undefined) return this.notificationService.warning('Address not found');

    const confirmed = await this.confirmService.confirm({ title: 'Delete address', message: 'Are you sure you want to delete this address?' })
    if (!confirmed) return;

    if (address.type === 'BILLING') {
      return this.notificationService.warning('Cannot delete billing address');
    }
    return this.http.delete<Address>(this.baseUrl + '/' + addressId,
      { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
      this.notificationService.success('Address deleted');
    });
  }
}
