package ch.mk.backend.services;

import ch.mk.backend.entities.RefreshToken;
import ch.mk.backend.entities.User;
import ch.mk.backend.repositories.RefreshTokenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class RefreshService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public byte[] generateRefreshToken() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return bytes;
    }

    public void saveRefreshToken(byte[] tokenBytes, User user, Boolean isRememberMe) {
        byte[] tokenHash = generateSHA256Hash(tokenBytes);
        if (existsByTokenHash(tokenHash)) return;

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRevoked(false);

        if (isRememberMe) {
            refreshToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        } else {
            refreshToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        }

        refreshTokenRepository.save(refreshToken);
    }

    public void revokeRefreshToken(byte[] token) {
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(token).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TOKEN_NOT_FOUND"));
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
    }

    public byte[] generateSHA256Hash(byte[] input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return digest.digest(input);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Boolean existsByTokenHash(byte[] token) {
        return refreshTokenRepository.findByTokenHash(token).stream().findFirst().isPresent();
    }
}
