import { Component, inject, Input } from '@angular/core';
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
        <h2>{{ product.name }}</h2>
        <p>$ {{ product.price }}</p>
      </div>
      <button (click)="addToCart()">
        ADD TO CART
      </button>
    </div>
  `,
  styleUrl: './product.component.css',
})
export class ProductComponent {
  @Input() product!: Product;
  cartService = inject(CartService);

  addToCart() {
    this.cartService.addItem(this.product.id);
  }
}
