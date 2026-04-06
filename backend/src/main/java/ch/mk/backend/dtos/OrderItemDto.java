package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OrderItemDto {
    private ProductDto product;
    private Integer quantity;
    private Double price;
}
