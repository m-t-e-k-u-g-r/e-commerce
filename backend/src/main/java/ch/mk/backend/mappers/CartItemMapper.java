package ch.mk.backend.mappers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.entities.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartItemMapper {
    CartItemDto toDto(CartItem cartItem);
}
