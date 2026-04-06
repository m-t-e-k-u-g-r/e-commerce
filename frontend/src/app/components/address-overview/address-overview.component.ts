import { Component, inject } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-overview',
  imports: [],
  template: `
    <table>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Address</th>
      </tr>
      @for (address of this.addressService.addresses(); track address.id) {
        <tr>
          <td>
            <button (click)="this.router.navigate(['/address/e/' + address.id ])">
              <i class="fas fa-edit"></i>
            </button>
          </td>
          <td>{{ address.forename }} {{ address.surname }}</td>
          <td class="address_info">
            {{ address.street }} {{ address.houseNumber }}<br/>
            {{ address.zipCode }} {{ address.city }}<br/>
            {{ address.country }}
          </td>
        </tr>
      }
    </table>
  `,
  styleUrl: './address-overview.component.css',
})
export class AddressOverviewComponent {
  addressService = inject(AddressService);
  router = inject(Router);
}
