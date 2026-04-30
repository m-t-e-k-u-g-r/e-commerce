package ch.mk.backend.controllers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.entities.CartItem;
import ch.mk.backend.entities.User;
import ch.mk.backend.mappers.CartItemMapper;
import ch.mk.backend.repositories.CartItemRepository;
import ch.mk.backend.services.CartItemService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartController {
    CartItemService cartItemService;
    private final CartItemMapper cartItemMapper;
    private final CartItemRepository cartItemRepository;

    public record UpdateQuantityRequest(int quantity) {}

    @GetMapping("/items")
    public List<CartItemDto> getCart(
            @AuthenticationPrincipal User user
    ) {
        return cartItemRepository.findByUserId(user.getId())
                .stream()
                .map(cartItemMapper::toDto)
                .toList();
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<Void> addToCart(
            @PathVariable int productId,
            @AuthenticationPrincipal User user
    ) {
        Optional<CartItem> existingItem = cartItemService.findCartItemByProductId(productId, user.getId());

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + 1);
            cartItemRepository.save(existingItem.get());
        } else {
            cartItemService.createCartItem(user.getId(), productId);
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Void> updateCartItemQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable int id,
            @RequestBody UpdateQuantityRequest request
    ) {
        var cartItem = cartItemRepository.findById(id);
        int quantity = request.quantity();

        if (cartItem.isPresent() && cartItemService.cartItemBelongsToUser(cartItem.get(), user.getId())) {
            if (quantity <= 0) {
                cartItemRepository.deleteById(id);
            } else {
                cartItem.get().setQuantity(quantity);
                cartItemRepository.save(cartItem.get());
            }
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable int id
    ) {
        var cartItem = cartItemRepository.findById(id);
        if (cartItem.isPresent() && cartItemService.cartItemBelongsToUser(cartItem.get(), user.getId())) {
            cartItemRepository.deleteById(id);
        } else {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal User user
    ) {
        var cartItems = cartItemRepository.findByUserId(user.getId());
        cartItemRepository.deleteAllById(cartItems.stream().map(CartItem::getId).toList());

        return ResponseEntity.noContent().build();
    }
}
