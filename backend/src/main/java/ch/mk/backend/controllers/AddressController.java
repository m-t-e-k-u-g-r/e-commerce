package ch.mk.backend.controllers;

import ch.mk.backend.dtos.AddressDto;
import ch.mk.backend.dtos.CreateAddressDto;
import ch.mk.backend.entities.User;
import ch.mk.backend.services.AddressService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@AllArgsConstructor
public class AddressController {
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
        return addressService.editAddress(user.getId(), addressId, addressDto);
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal User user,
            @PathVariable int addressId
    ) {
        return addressService.deleteAddress(user.getId(), addressId);
    }
}
