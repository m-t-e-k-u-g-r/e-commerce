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

@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartController {
    private final CartItemService cartItemService;
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
        return cartItemService.increaseQuantity(user.getId(), productId);
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Void> setQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable int id,
            @RequestBody UpdateQuantityRequest request
    ) {
        return cartItemService.updateQuantity(user.getId(), id, request);
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable int id
    ) {
        return cartItemService.removeItem(user.getId(), id);
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
