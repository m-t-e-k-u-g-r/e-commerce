package ch.mk.backend.mappers;

import ch.mk.backend.dtos.CartItemDto;
import ch.mk.backend.entities.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductResolver.class})
public interface CartItemMapper {
    @Mapping(source = "product.id", target = "productId")
    CartItemDto toDto(CartItem cartItem);

    @Mapping(target = "product", source = "productId", qualifiedByName = "mapProduct")
    CartItem toEntity(CartItemDto dto);
}
