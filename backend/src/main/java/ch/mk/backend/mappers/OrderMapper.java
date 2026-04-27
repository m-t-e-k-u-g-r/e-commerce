package ch.mk.backend.mappers;

import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.time.LocalDate;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, OrderAddressMapper.class})
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "items", target = "items")
    @Mapping(source = "createdAt", target = "createdDate")
    OrderDto toDto(Order order);

    default LocalDate map(Instant instant) {
        if (instant == null) {
            return null;
        }
        return instant.atZone(java.time.ZoneId.systemDefault()).toLocalDate();
    }
}
