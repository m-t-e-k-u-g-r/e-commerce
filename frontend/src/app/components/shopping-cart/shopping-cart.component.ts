import { Component, computed, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgOptimizedImage } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-shopping-cart',
  imports: [NgOptimizedImage],
  template: `
    <h1>Shopping Cart</h1>
    <div class="shopping_cart">
      <table>
        <tr class="divided">
          <td colspan="2">
            You have {{ this.cartService.totalItems() }} item{{
              this.cartService.totalItems() == 1 ? '' : 's'
            }}
            in your shopping cart
          </td>
          <td colspan="2" class="right">
            <button (click)="this.cartService.clearCart()" class="clear">
              Clear Shopping Cart
            </button>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="buffer"></td>
        </tr>
        <tr class="head divided">
          <td></td>
          <td>Product</td>
          <td class="center">Quantity</td>
          <td class="right">Price</td>
        </tr>
        <tr>
          <td colspan="4" class="buffer"></td>
        </tr>
        @for (cartItem of computedCartItems(); track cartItem.productId) {
          @if (cartItem.product) {
            <tr class="divided">
              <td>
                <div class="img_wrapper">
                  <img
                    [ngSrc]="cartItem.product.imageUrl"
                    priority
                    width="100"
                    height="100"
                    [alt]="cartItem.product.name"
                  />
                </div>
              </td>
              <td>{{ cartItem.product.name }}</td>
              <td>
                <div class="quantity_controls">
                  <button (click)="this.cartService.reduceQuantity(cartItem.productId)">-</button>
                  <span class="quantity_value">{{ cartItem.quantity }} in cart</span>
                  <button (click)="this.cartService.addItem(cartItem.productId)">+</button>
                </div>
              </td>
              <td class="right">$ {{ (cartItem.product.price * cartItem.quantity).toFixed(2) }}</td>
            </tr>
          }
        }
        <tr class="divided">
          <td colspan="4">
            <p class="total_amount">Total: $ {{ this.cartService.totalAmount() }}</p>
          </td>
        </tr>
        <tr>
          <td colspan="4">
            <button (click)="checkout()" class="checkout">Check out</button>
          </td>
        </tr>
      </table>
    </div>
  `,
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  addressService = inject(AddressService);
  orderService = inject(OrderService)

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

  checkout() {
    const billingAddress = this.addressService.billingAddress();
    if (billingAddress) {
      const id = billingAddress.id;
      this.orderService.createOrder(id);
    }
  }
}
