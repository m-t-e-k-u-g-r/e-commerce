package ch.mk.backend.services;

import ch.mk.backend.controllers.CartController;
import ch.mk.backend.entities.CartItem;
import ch.mk.backend.repositories.CartItemRepository;
import ch.mk.backend.repositories.ProductRepository;
import ch.mk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ResponseEntity<Void> increaseQuantity(UUID userId, UUID productId) {
        Optional<CartItem> existingItem = findCartItemByProductId(productId, userId);

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + 1);
            cartItemRepository.save(existingItem.get());
        } else {
            createCartItem(userId, productId);
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> updateQuantity(UUID userId, Integer productId, CartController.UpdateQuantityRequest request) {
        var cartItem = cartItemRepository.findById(productId);
        int quantity = request.quantity();

        if (cartItem.isPresent() && cartItemBelongsToUser(cartItem.get(), userId)) {
            if (quantity <= 0) {
                cartItemRepository.deleteById(productId);
            } else {
                cartItem.get().setQuantity(quantity);
                cartItemRepository.save(cartItem.get());
            }
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> removeItem(UUID userId, Integer itemId) {
        var cartItem = cartItemRepository.findById(itemId);
        if (cartItem.isPresent() && cartItemBelongsToUser(cartItem.get(), userId)) {
            cartItemRepository.deleteById(itemId);
        } else {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    private Boolean cartItemBelongsToUser(CartItem cartItem, UUID userId) {
        return cartItem.getUser().getId().equals(userId);
    }

    private Optional<CartItem> findCartItemByProductId(UUID productId, UUID userId) {
        var cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), productId))
                .findFirst();
    }

    private void createCartItem(UUID userId, UUID productId) {
        var cartItem = new CartItem();
        cartItem.setQuantity(1);
        if (userRepository.findById(userId).isPresent() && productRepository.findById(productId).isPresent()) {
            cartItem.setUser(userRepository.findById(userId).get());
            cartItem.setProduct(productRepository.findById(productId).get());
        }
        cartItemRepository.save(cartItem);
    }
}
