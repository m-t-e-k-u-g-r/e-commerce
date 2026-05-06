package ch.mk.backend.repositories;

import ch.mk.backend.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Integer> {
    List<Order> findByUserId(Integer userId);
    Optional<Order> findByIdAndUserId(Integer id, Integer userId);
}
