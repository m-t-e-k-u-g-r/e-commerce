package ch.mk.backend.services;

import ch.mk.backend.entities.ApplicationConfig;
import ch.mk.backend.repositories.ApplicationConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecretsService {
    private final ApplicationConfigRepository applicationConfigRepository;

    public String getAccessTokenSecret() {
        Optional<ApplicationConfig> config = applicationConfigRepository.findByKey("jwt.access.secret");
        if (config.isPresent()) {
            return config.get().getValue();
        } else {
            String secret = generateSecret(64);
            ApplicationConfig newConfig = new ApplicationConfig();
            newConfig.setKey("jwt.access.secret");
            newConfig.setValue(secret);
            applicationConfigRepository.save(newConfig);
            return secret;
        }
    }

    public String getRefreshTokenSecret() {
        Optional<ApplicationConfig> config = applicationConfigRepository.findByKey("jwt.refresh.secret");
        if (config.isPresent()) {
            return config.get().getValue();
        } else {
            String secret = generateSecret(64);
            ApplicationConfig newConfig = new ApplicationConfig();
            newConfig.setKey("jwt.refresh.secret");
            newConfig.setValue(secret);
            applicationConfigRepository.save(newConfig);
            return secret;
        }
    }

    private String generateSecret(int bytes) {
        SecureRandom random = new SecureRandom();

        byte[] secret = new byte[bytes];
        random.nextBytes(secret);

        return Base64.getEncoder().encodeToString(secret);
    }
}
