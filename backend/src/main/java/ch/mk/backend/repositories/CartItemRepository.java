package ch.mk.backend.repositories;

import ch.mk.backend.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem,Integer> {
    List<CartItem> findByUserId(UUID userId);
}
