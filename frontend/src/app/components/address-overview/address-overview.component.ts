import { Component, inject } from '@angular/core';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-address-overview',
  imports: [],
  template: `
    <table>
      <tr>
        <th>Name</th>
        <th>Address</th>
      </tr>
      @for (address of this.addressService.addresses(); track address.id) {
        <tr>
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
}
