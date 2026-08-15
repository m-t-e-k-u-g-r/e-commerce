package ch.mk.backend.dtos;

import ch.mk.backend.entities.AddressType;
import ch.mk.backend.entities.Country;
import ch.mk.backend.entities.Salutation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@Getter
@Setter
public class AddressDto {
    private UUID id;
    private UUID userId;
    private AddressType type;
    private Salutation salutation;
    private String forename;
    private String surname;
    private String street;
    private String houseNumber;
    private String zipCode;
    private String city;
    private Country country;
}
