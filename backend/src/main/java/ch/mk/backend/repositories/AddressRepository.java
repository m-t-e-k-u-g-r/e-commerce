package ch.mk.backend.repositories;

import ch.mk.backend.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    List<Address> findByUserId(Integer userId);
    Optional<Address> findByUserIdAndId(Integer userId, Integer id);
}
