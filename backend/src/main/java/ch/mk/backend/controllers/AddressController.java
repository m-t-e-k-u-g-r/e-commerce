package ch.mk.backend.controllers;

import ch.mk.backend.dtos.AddressDto;
import ch.mk.backend.dtos.CreateAddressDto;
import ch.mk.backend.entities.Address;
import ch.mk.backend.repositories.AddressRepository;
import ch.mk.backend.services.AddressService;
import ch.mk.backend.services.JWTService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users/addresses")
@AllArgsConstructor
public class AddressController {

    private final JWTService jwtService;
    private final AddressRepository addressRepository;
    private final AddressService addressService;

    @GetMapping
    public List<AddressDto> getAddresses(
            @CookieValue("accessToken") String accessToken
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);

        return addressService.getAddressDtosByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Void> createAddress(
            @CookieValue("accessToken") String accessToken,
            @RequestBody CreateAddressDto addressDto
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        addressService.createAddress(userId, addressDto);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<Void> updateAddress(
            @CookieValue("accessToken") String accessToken,
            @PathVariable int addressId,
            @RequestBody CreateAddressDto addressDto
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        Optional<Address> address = addressRepository.findByUserIdAndId(userId, addressId);
        if (address.isPresent()) {
            addressService.updateAddressFields(address.get(), addressDto);
            addressRepository.save(address.get());

            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @CookieValue("accessToken") String accessToken,
            @PathVariable int addressId
    ) {
        Integer userId = jwtService.getUserIdFromAccessToken(accessToken);
        Optional<Address> address = addressRepository.findById(addressId);

        if (address.isPresent() && address.get().getUser().getId().equals(userId)) {
            addressRepository.deleteById(addressId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
