package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@Getter
@Setter
public class CartItemDto {
    private Integer id;
    private Integer quantity;
    private UUID productId;
}
