package ch.mk.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class AddressDto {
    private Integer id;
    private Integer userId;
    private String type;
    private String salutation;
    private String forename;
    private String surname;
    private String street;
    private String houseNumber;
    private String zipCode;
    private String city;
    private String country;
}
