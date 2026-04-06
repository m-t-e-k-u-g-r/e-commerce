package ch.mk.backend.mappers;

import ch.mk.backend.dtos.OrderAddressDto;
import ch.mk.backend.entities.OrderAddress;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderAddressMapper {
    OrderAddressDto toDto(OrderAddress orderAddress);
}
