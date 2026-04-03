import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../models/product.type';

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
    </div>
  `,
  styleUrl: './product.component.css',
})
export class ProductComponent {
  @Input() product!: Product;
}
