package ch.mk.backend.repositories;

import ch.mk.backend.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserId(UUID user_id);
    Optional<Address> findByUserIdAndId(UUID user_id, UUID id);
}
