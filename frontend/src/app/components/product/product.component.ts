import { Component, computed, inject, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.type';
import { CartService } from '../../services/cart.service';
import { MatCard, MatCardContent, MatCardImage, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [
    NgOptimizedImage,
    MatCard,
    MatCardImage,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    CurrencyPipe,
  ],
  template: `
    <mat-card class="product">
      <img
        mat-card-image
        ngSrc="{{ product.imageUrl }}"
        width="16"
        height="9"
        alt="{{ product.name }}"
      />
      <mat-card-content>
        <div class="product_detail">
          <mat-card-title>{{ product.name }}</mat-card-title>
          <mat-card-subtitle>{{ product.price | currency:'USD':'symbol' }}</mat-card-subtitle>
        </div>
        <div class="button_container">
          @if (itemInCart() !== undefined) {
            <button (click)="decreaseQuantityByOne()"><h3>-</h3></button>
            <p class="quantity">{{ itemInCart()?.quantity }}</p>
            <button (click)="addToCart()"><h3>+</h3></button>
          } @else {
            <button (click)="addToCart()" class="full_width"><h3>ADD TO CART</h3></button>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product!: Product;
  cartService = inject(CartService);
  itemInCart = computed(() =>
    this.cartService.cart().find((ci) => ci.productId === this.product?.id),
  );

  addToCart() {
    this.cartService.addItem(this.product.id);
  }

  decreaseQuantityByOne() {
    this.cartService.reduceQuantity(this.product.id);
  }
}
