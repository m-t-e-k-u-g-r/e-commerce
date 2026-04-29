package ch.mk.backend.repositories;

import ch.mk.backend.entities.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest,Integer> {
}
