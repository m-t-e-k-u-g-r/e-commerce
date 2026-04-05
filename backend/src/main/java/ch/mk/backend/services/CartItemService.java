package ch.mk.backend.services;

import ch.mk.backend.entities.CartItem;
import ch.mk.backend.repositories.CartItemRepository;
import ch.mk.backend.repositories.ProductRepository;
import ch.mk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Boolean cartItemBelongsToUser(CartItem cartItem, Integer userId) {
        return cartItem.getUser().getId().equals(userId);
    }

    public Optional<CartItem> findCartItemByProductId(Integer productId, Integer userId) {
        var cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), productId))
                .findFirst();
    }

    public void createCartItem(Integer userId, Integer productId) {
        var cartItem = new CartItem();
        if (userRepository.findById(userId).isPresent() && productRepository.findById(productId).isPresent()) {
            cartItem.setUser(userRepository.findById(userId).get());
            cartItem.setProduct(productRepository.findById(productId).get());
        }
        cartItemRepository.save(cartItem);
    }
}
