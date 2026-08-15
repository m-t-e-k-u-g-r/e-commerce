package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class GuestOrderDto {
    private UUID id;
    private String status;
    private Double totalPrice;
    private OrderAddressDto address;
    private List<OrderItemDto> items;
    private Instant createdAt;
}
