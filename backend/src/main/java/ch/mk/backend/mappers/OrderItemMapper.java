package ch.mk.backend.mappers;

import ch.mk.backend.dtos.OrderItemDto;
import ch.mk.backend.entities.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderItemMapper {
    OrderItemDto toDto(OrderItem orderItem);
}
