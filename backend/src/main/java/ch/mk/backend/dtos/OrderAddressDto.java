package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OrderAddressDto {
    private Integer id;
    private String street;
    private String houseNumber;
    private String zipCode;
    private String city;
    private String country;
}
