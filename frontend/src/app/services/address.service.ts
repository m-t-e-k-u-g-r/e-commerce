import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Address, AddressDto, AddressForm } from '../models/address.type';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
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
      console.log('Fetched addresses:', addresses);
      this._addresses.set(addresses);
    });
  }

  addAddress(address: AddressDto) {
    return this.http.post<Address>(this.baseUrl, address,
      { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
    });
  }

  changeAddress(address: AddressForm) {
    return this.http.put<Address>(this.baseUrl + '/' + address.id,
      address, { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
    });
  }

  deleteAddress(addressId: number) {
    const address = this.addresses().find((a: Address) => a.id === addressId);
    if (address?.type === 'BILLING') {
      console.error('Cannot delete billing address');
      return;
    }
    return this.http.delete<Address>(this.baseUrl + '/' + addressId,
      { withCredentials: true }
    ).subscribe(() => {
      this.getAddresses();
    });
  }
}
