package ch.mk.backend.repositories;

import ch.mk.backend.entities.ApplicationConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationConfigRepository extends JpaRepository<ApplicationConfig,Integer> {
    Optional<ApplicationConfig> findByKey(String key);
}
