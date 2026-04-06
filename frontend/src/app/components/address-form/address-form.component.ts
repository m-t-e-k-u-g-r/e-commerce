import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address, AddressDto } from '../../models/address.type';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="addressForm" (ngSubmit)="onSubmit()">
      <h2>
        @if (selectedAddress) {
          @if (selectedAddress.type === 'BILLING') {
            Change billing address
          } @else {
            Change shipping address
          }
        } @else {
            Add new address
        }
      </h2>

      <h3>Personal Information</h3>
      <select formControlName="salutation">
        <option value=""></option>
        <option value="MR">Mr</option>
        <option value="MS">Ms</option>
      </select>

      <label>Forename
        <input type="text" formControlName="forename" />
      </label>
      <label>Surname
        <input type="text" formControlName="surname" />
      </label>

      <h3>Billing address</h3>
      <label>Street
        <input type="text" formControlName="street" />
      </label>
      <label>House number
        <input type="text" formControlName="houseNumber" />
      </label>
      <label>Zip code
        <input type="text" formControlName="zipCode" />
      </label>
      <label>City
        <input type="text" formControlName="city" />
      </label>
      <label>Country
        <select formControlName="country">
          <option value=""></option>
          <option value="DE">Germany</option>
          <option value="AT">Austria</option>
          <option value="CH">Switzerland</option>
        </select>
      </label>

      <button type="submit" [disabled]="addressForm.invalid">Save</button>
    </form>
  `,
  styleUrl: './address-form.component.css',
})
export class AddressFormComponent implements OnInit {
  private addressService = inject(AddressService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  addressId?: number;
  selectedAddress?: Address;

  addressForm: FormGroup<{
    salutation: FormControl<string>;
    forename: FormControl<string>;
    surname: FormControl<string>;
    street: FormControl<string>;
    houseNumber: FormControl<string>;
    zipCode: FormControl<string>;
    city: FormControl<string>;
    country: FormControl<string>;
  }> = new FormGroup({
    salutation: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    forename: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    surname: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    street: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    houseNumber: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    zipCode: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  onSubmit() {
    if (this.addressForm.invalid) return;
    let type = 'BILLING';
    if (this.selectedAddress) {
      type = this.selectedAddress.type;
    } else if (this.addressService.billingAddress()) {
      type = 'SHIPPING';
    }

    const formValue = this.addressForm.getRawValue();
    const addressData: AddressDto = {
      ...formValue,
      type: type
    }
    if (this.addressId) {
      const updatedAddress = {
        ...addressData,
        id: this.addressId
      };
      this.addressService.changeAddress(updatedAddress);
    } else {
      this.addressService.addAddress(addressData);
    }
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.addressId = Number(idParam);
        const address = this.addressService.addresses().find((a) => a.id === this.addressId);
        this.selectedAddress = address;
        if (address) {
          this.addressForm.patchValue({
            salutation: address.salutation,
            forename: address.forename,
            surname: address.surname,
            street: address.street,
            houseNumber: address.houseNumber,
            zipCode: address.zipCode,
            city: address.city,
            country: address.country,
          });
        }
      }
    });
  }
}
