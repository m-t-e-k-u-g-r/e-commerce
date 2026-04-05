package ch.mk.backend.controllers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.mappers.CartItemMapper;
import ch.mk.backend.repositories.CartItemRepository;
import ch.mk.backend.services.JWTService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cart")
@AllArgsConstructor
public class CartController {
    private final CartItemMapper cartItemMapper;
    private final CartItemRepository cartItemRepository;
    private final JWTService jwtService;

    @GetMapping("/items")
    public List<CartItemDto> getCart(
            @CookieValue("accessToken") String accessToken
    ) {
        var claims = jwtService.checkAccessToken(accessToken);
        Integer userId = Integer.valueOf(claims.getPayload().getSubject());

        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(cartItemMapper::toDto)
                .toList();
    }

    // TODO: POST /cart/items - Add item to cart
    // TODO: PUT /cart/items/{id} - Update item quantity
    // TODO: DELETE /cart/items/{id} - Remove item from cart
    // TODO: DELETE /cart - Clear cart
}
