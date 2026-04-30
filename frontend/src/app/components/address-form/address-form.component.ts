import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address, AddressDto } from '../../models/address.type';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule, MatFormField, MatSelect, MatOption, MatLabel, MatInput, MatButton],
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
          @if (this.addressService.billingAddress()) {
            Add new shipping address
          } @else {
            Add billing address
          }
        }
      </h2>

      <div class="input_wrapper">
        <section class="form-section">
          <h3>Personal Information</h3>
          <mat-form-field>
            <mat-label>Salutation</mat-label>
            <mat-select formControlName="salutation">
              <mat-option value="MR">Mr</mat-option>
              <mat-option value="MS">Ms</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Forename</mat-label>
            <input matInput type="text" formControlName="forename" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Surname</mat-label>
            <input matInput type="text" formControlName="surname" />
          </mat-form-field>
        </section>

        <section class="form-section">
          <h3>Address</h3>
          <mat-form-field>
            <mat-label>Street</mat-label>
            <input matInput type="text" formControlName="street" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>House number</mat-label>
            <input matInput type="text" formControlName="houseNumber" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Zip Code</mat-label>
            <input matInput type="text" formControlName="zipCode" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>City</mat-label>
            <input matInput type="text" formControlName="city" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Country</mat-label>
            <mat-select formControlName="country">
              <mat-option value="DE">Germany</mat-option>
              <mat-option value="AT">Austria</mat-option>
              <mat-option value="CH">Switzerland</mat-option>
            </mat-select>
          </mat-form-field>
        </section>
      </div>

      <button matButton="elevated" type="submit" [disabled]="addressForm.invalid">Save</button>
    </form>
  `,
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent implements OnInit {
  protected addressService = inject(AddressService);
  private authService = inject(AuthService);
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
      type: type,
    };
    if (this.addressId) {
      const updatedAddress = {
        ...addressData,
        id: this.addressId,
      };
      this.addressService.changeAddress(updatedAddress);
    } else {
      this.addressService.addAddress(addressData);
    }
    this.router.navigate(['/address']);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.addressId = Number(idParam);
        let address: Address | undefined;
        if (this.authService.isLoggedIn()) {
          address = this.addressService.addresses().find((a) => a.id === this.addressId);
        } else {
          address = this.addressService.guestAddress() ?? undefined;
        }
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
