package ch.mk.backend.controllers;

import ch.mk.backend.dtos.AddressDto;
import ch.mk.backend.dtos.CreateAddressDto;
import ch.mk.backend.entities.Address;
import ch.mk.backend.entities.User;
import ch.mk.backend.repositories.AddressRepository;
import ch.mk.backend.services.AddressService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users/addresses")
@AllArgsConstructor
public class AddressController {

    private final AddressRepository addressRepository;
    private final AddressService addressService;

    @GetMapping
    public List<AddressDto> getAddresses(
            @AuthenticationPrincipal User user
    ) {
        return addressService.getAddressDtosByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<Void> createAddress(
            @AuthenticationPrincipal User user,
            @RequestBody CreateAddressDto addressDto
    ) {
        addressService.createAddress(user.getId(), addressDto);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<Void> updateAddress(
            @AuthenticationPrincipal User user,
            @PathVariable int addressId,
            @RequestBody CreateAddressDto addressDto
    ) {
        Optional<Address> address = addressRepository.findByUserIdAndId(user.getId(), addressId);
        if (address.isPresent()) {
            addressService.updateAddressFields(address.get(), addressDto);
            addressRepository.save(address.get());

            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal User user,
            @PathVariable int addressId
    ) {
        Optional<Address> address = addressRepository.findById(addressId);

        if (address.isPresent() && address.get().getUser().getId().equals(user.getId())) {
            addressRepository.deleteById(addressId);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
