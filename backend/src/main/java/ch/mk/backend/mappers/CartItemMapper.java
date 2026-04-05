package ch.mk.backend.mappers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.entities.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    @Mapping(source = "product.id", target = "productId")
    CartItemDto toDto(CartItem cartItem);
}
