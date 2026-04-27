package ch.mk.backend.repositories;

import ch.mk.backend.entities.OrderAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderAddressRepository extends JpaRepository<OrderAddress,Integer> {
}
