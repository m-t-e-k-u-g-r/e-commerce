package ch.mk.backend.mappers;

import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.entities.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderDto toDto(Order order);
}
