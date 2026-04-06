package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
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
