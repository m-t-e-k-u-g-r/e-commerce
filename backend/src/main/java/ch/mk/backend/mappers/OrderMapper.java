package ch.mk.backend.mappers;

import ch.mk.backend.dtos.GuestOrderCreatedDto;
import ch.mk.backend.dtos.GuestOrderDto;
import ch.mk.backend.dtos.OrderDto;
import ch.mk.backend.entities.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, OrderAddressMapper.class})
public interface OrderMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "address", target = "address")
    @Mapping(source = "items", target = "items")
    @Mapping(source = "createdAt", target = "createdAt")
    OrderDto toDto(Order order);

    @Mappings({
            @Mapping(target = "guestId", source = "guestId"),
            @Mapping(target = "accessToken", source = "accessToken"),
    })
    GuestOrderCreatedDto toGuestOrderDto(OrderDto orderDto, Integer guestId, String accessToken);

    @Mapping(source = "createdAt", target = "createdAt")
    GuestOrderDto getGuestOrderDto(Order order);
}
