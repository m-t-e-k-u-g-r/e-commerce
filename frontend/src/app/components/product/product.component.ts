import { Component, computed, inject, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.type';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  imports: [NgOptimizedImage],
  template: `
    <div class="product">
      <img
        ngSrc="{{ product.imageUrl }}"
        priority
        width="800"
        height="450"
        alt="{{ product.name }}"
      />
      <div class="product_detail">
        <h1>{{ product.name }}</h1>
        <p>$ {{ product.price }}</p>
      </div>
      <div class="button_container">
        @if (itemInCart() !== undefined) {
          <button (click)="decreaseQuantityByOne()"><h3>-</h3></button>
          <p class="quantity">{{ itemInCart()?.quantity }} in cart</p>
          <button (click)="increaseQuantityByOne()"><h3>+</h3></button>
        } @else {
          <button (click)="addToCart()" class="full_width"><h3>ADD TO CART</h3></button>
        }
      </div>
    </div>
  `,
  styleUrl: './product.component.css',
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

  increaseQuantityByOne() {
    this.cartService.addItem(this.product.id);
  }

  decreaseQuantityByOne() {
    this.cartService.reduceQuantity(this.product.id);
  }
}
