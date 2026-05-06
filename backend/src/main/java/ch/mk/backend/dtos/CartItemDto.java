package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class CartItemDto {
    private Integer id;
    private Integer quantity;
    private Integer productId;
}
