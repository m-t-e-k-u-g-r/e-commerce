package ch.mk.backend.services;

import ch.mk.backend.dtos.AddressDto;
import ch.mk.backend.dtos.CreateAddressDto;
import ch.mk.backend.entities.Address;
import ch.mk.backend.entities.AddressType;
import ch.mk.backend.entities.User;
import ch.mk.backend.mappers.AddressMapper;
import ch.mk.backend.repositories.AddressRepository;
import ch.mk.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;
    private final UserRepository userRepository;

    public Optional<Address> getAddressByIdAndUserId(Integer addressId, Integer userId) {
        return addressRepository.findByUserIdAndId(userId, addressId);
    }

    public List<AddressDto> getAddressDtosByUserId(Integer userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(addressMapper::toDto)
                .toList();
    }

    public Optional<Address> getBillingAddress(Integer userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .filter(address -> address.getType().equals(AddressType.BILLING))
                .findFirst();
    }

    public void createAddress(Integer userId, CreateAddressDto addressDto) {
        Address address;
        if (addressDto.getType().equals(AddressType.BILLING)) {
            Optional<Address> existingBillingAddress = getBillingAddress(userId);
            address = existingBillingAddress.orElseGet(() -> createNewAddressEntity(userId, addressDto));
        } else {
            address = createNewAddressEntity(userId, addressDto);
        }
        updateAddressFields(address, addressDto);
        addressRepository.save(address);
    }

    public ResponseEntity<Void> editAddress(Integer userId, Integer addressId, CreateAddressDto addressDto) {
        Optional<Address> address = addressRepository.findByUserIdAndId(userId, addressId);
        if (address.isPresent()) {
            updateAddressFields(address.get(), addressDto);
            addressRepository.save(address.get());

            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> deleteAddress(Integer userId, Integer addressId) {
        Optional<Address> address = addressRepository.findByUserIdAndId(userId, addressId);
        if (address.isPresent()) {
            addressRepository.delete(address.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    private Address createNewAddressEntity(Integer userId, CreateAddressDto addressDto) {
        Address address = new Address();
        address.setType(addressDto.getType());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));
        address.setUser(user);

        return address;
    }

    public void updateAddressFields(Address address, CreateAddressDto dto) {
        address.setSalutation(dto.getSalutation());
        address.setForename(dto.getForename());
        address.setSurname(dto.getSurname());
        address.setStreet(dto.getStreet());
        address.setHouseNumber(dto.getHouseNumber());
        address.setZipCode(dto.getZipCode());
        address.setCity(dto.getCity());
        address.setCountry(dto.getCountry());
    }
}
