import { Component, computed, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [NgOptimizedImage],
  template: `
    <h1>Shopping Cart</h1>
    <div class="shopping_cart">
      <table>
        <tr>
          <td>Image</td>
          <td>Product</td>
          <td>Quantity</td>
          <td>Price</td>
        </tr>
        @for (cartItem of computedCartItems(); track cartItem.productId) {
          @if (cartItem.product) {
            <tr>
              <td>
                <img
                  [ngSrc]="cartItem.product.imageUrl"
                  width="200"
                  height="200"
                  [alt]="cartItem.product.name"
                />
              </td>
              <td>{{ cartItem.product.name }}</td>
              <td></td>
              <td>{{ cartItem.quantity }} in cart</td>
              <td>{{ (cartItem.product.price * cartItem.quantity).toFixed(2) }}</td>
            </tr>
          }
        }
      </table>
    </div>
  `,
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);

  computedCartItems = computed(() => {
    const products = this.productService.products();
    const cartItems = this.cartService.cart();

    return cartItems.map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      return {
        ...cartItem,
        product: product,
      };
    });
  });
}
