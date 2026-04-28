import { Component, inject } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';
import { MatCell, MatCellDef, MatColumnDef, MatFooterCell, MatFooterCellDef,
  MatFooterRow, MatFooterRowDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from '@angular/material/table';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-address-overview',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatIcon,
    MatFooterCell,
    MatFooterCellDef,
    MatFabButton,
    MatMiniFabButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatFooterRow,
    MatFooterRowDef,
  ],
  template: `
    <table
      mat-table
      [dataSource]="this.addressService.addresses()"
      class="address_overview"
    >
      <ng-container matColumnDef="edit">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let address">
          <button mat-mini-fab (click)="this.router.navigate(['/address/e/' + address.id])">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let address">{{ address.forename }} {{ address.surname }}</td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container>

      <ng-container matColumnDef="address">
        <th mat-header-cell *matHeaderCellDef>Address</th>
        <td mat-cell *matCellDef="let address" class="address_info">
          {{ address.street }} {{ address.houseNumber }}<br />
          {{ address.zipCode }} {{ address.city }}<br />
          {{ address.country }}
        </td>
        <td mat-footer-cell *matFooterCellDef></td>
      </ng-container>

      <ng-container matColumnDef="delete">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let address">
          <button
            mat-mini-fab
            (click)="this.addressService.deleteAddress(address.id)"
            [disabled]="this.addressService.billingAddress()?.id == address.id"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <ng-container matColumnDef="footer-add-button">
        <td mat-footer-cell *matFooterCellDef>
          <button mat-fab extended (click)="this.router.navigate(['/address/new'])">
            <mat-icon>add</mat-icon>
            Add new address
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      <tr mat-footer-row *matFooterRowDef="['footer-add-button']"></tr>
    </table>
  `,
  styleUrl: './address-overview.component.scss',
})
export class AddressOverviewComponent {
  addressService = inject(AddressService);
  router = inject(Router);
  displayedColumns: string[] = ['edit', 'name', 'address', 'delete'];
}
