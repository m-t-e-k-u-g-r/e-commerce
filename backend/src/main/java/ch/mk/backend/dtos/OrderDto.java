package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDto {
    private Integer id;
    private Integer userId;
    private String status;
    private Double totalPrice;
    private OrderAddressDto address;
    private List<OrderItemDto> items;
    private LocalDate createdDate;
}
