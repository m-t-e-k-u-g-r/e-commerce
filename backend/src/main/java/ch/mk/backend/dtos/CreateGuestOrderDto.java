package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class CreateGuestOrderDto {
    private String email;
    private CreateAddressDto address;
    private List<CartItemDto> items;
}
