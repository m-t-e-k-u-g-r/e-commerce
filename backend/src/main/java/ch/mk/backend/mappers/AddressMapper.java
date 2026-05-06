package ch.mk.backend.mappers;

import ch.mk.backend.dtos.AddressDto;
import ch.mk.backend.dtos.CreateAddressDto;
import ch.mk.backend.entities.Address;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(source = "user.id", target = "userId")
    AddressDto toDto(Address address);
    CreateAddressDto toCreateDto(Address address);
}
