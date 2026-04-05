package ch.mk.backend.controllers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.entities.CartItem;
import ch.mk.backend.mappers.CartItemMapper;
import ch.mk.backend.repositories.CartItemRepository;
import ch.mk.backend.services.CartItemService;
import ch.mk.backend.services.JWTService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final JWTService jwtService;

    public record UpdateQuantityRequest(int quantity) {}

    @GetMapping("/items")
    public List<CartItemDto> getCart(
            @CookieValue("accessToken") String accessToken
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);

        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(cartItemMapper::toDto)
                .toList();
    }

    @PostMapping("/items/{productId}")
    public ResponseEntity<Void> addToCart(
            @PathVariable int productId,
            @CookieValue("accessToken") String accessToken
    ) {
        var claims = jwtService.checkAccessToken(accessToken);
        Integer userId = Integer.valueOf(claims.getPayload().getSubject());

        Optional<CartItem> existingItem = cartItemService.findCartItemByProductId(productId, userId);

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + 1);
            cartItemRepository.save(existingItem.get());
        } else {
            cartItemService.createCartItem(userId, productId);
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Void> updateCartItemQuantity(
            @CookieValue("accessToken") String accessToken,
            @PathVariable int id,
            @RequestBody UpdateQuantityRequest request
    ) {
        var userId = Integer.valueOf(jwtService.checkAccessToken(accessToken).getPayload().getSubject());
        var cartItem = cartItemRepository.findById(id);
        int quantity = request.quantity();

        if (cartItem.isPresent() && cartItemService.cartItemBelongsToUser(cartItem.get(), userId)) {
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
            @CookieValue("accessToken") String accessToken,
            @PathVariable int id
    ) {
        var userId = Integer.valueOf(jwtService.checkAccessToken(accessToken).getPayload().getSubject());
        var cartItem = cartItemRepository.findById(id);
        if (cartItem.isPresent() && cartItemService.cartItemBelongsToUser(cartItem.get(), userId)) {
            cartItemRepository.deleteById(id);
        } else {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @CookieValue("accessToken") String accessToken
    ) {
        var claims = jwtService.checkAccessToken(accessToken);
        Integer userId = Integer.valueOf(claims.getPayload().getSubject());

        var cartItems = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAllById(cartItems.stream().map(CartItem::getId).toList());

        return ResponseEntity.noContent().build();
    }
}
