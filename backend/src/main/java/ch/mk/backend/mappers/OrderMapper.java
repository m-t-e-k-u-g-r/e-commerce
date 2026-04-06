package ch.mk.backend.mappers;

import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, OrderAddressMapper.class})
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "items", target = "items")
    OrderDto toDto(Order order);
}
