package ch.mk.backend.services;

import ch.mk.backend.entities.RefreshToken;
import ch.mk.backend.entities.User;
import ch.mk.backend.repositories.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class JWTService {
    @Autowired
    private SecretsService secretsService;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    public Integer MilliToDays = 24 * 60 * 60 * 1000;
    public Integer MilliToMinutes = 60 * 1000;
    public String claimName = "rememberMe";

    public String generateAccessToken(UUID userId) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(String.valueOf(userId))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 10L * MilliToMinutes))
                .and()
                .signWith(getAccessTokenKey())
                .compact();
    }

    public String generateRefreshToken(UUID userId, Boolean isRememberMe) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(claimName, isRememberMe);
        Date expiration = isRememberMe
                ? new Date(System.currentTimeMillis() + 30L * MilliToDays)
                : new Date(System.currentTimeMillis() + 7L * MilliToDays);

        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claims()
                .add(claims)
                .subject(String.valueOf(userId))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(expiration)
                .and()
                .signWith(getRefreshTokenKey())
                .compact();
    }

    public Claims extractClaims(String token, String signingKey) {
        SecretKey key = getAccessTokenKey();
        if (Objects.equals(signingKey, "refresh")) key = getRefreshTokenKey();

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Jws<Claims> checkRefreshToken(String refreshToken) {
        return Jwts.parser()
                .verifyWith(getRefreshTokenKey())
                .build()
                .parseSignedClaims(refreshToken);
    }

    public Jws<Claims> checkAccessToken(String accessToken) {
        return Jwts.parser()
                .verifyWith(getAccessTokenKey())
                .build()
                .parseSignedClaims(accessToken);
    }

    private SecretKey getAccessTokenKey() {
        String accessTokenSecret = secretsService.getAccessTokenSecret();
        byte[] keyBytes = Decoders.BASE64.decode(accessTokenSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getRefreshTokenKey() {
        String refreshTokenSecret = secretsService.getRefreshTokenSecret();
        byte[] keyBytes = Decoders.BASE64.decode(refreshTokenSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void saveRefreshToken(String tokenString, User user, Boolean isRememberMe) {
        if (existsByToken(tokenString)) return;

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(tokenString);
        refreshToken.setRevoked(false);

        if (isRememberMe) {
            refreshToken.setExpiresAt(Instant.now().plus(30, ChronoUnit.DAYS));
        } else {
            refreshToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
        }

        refreshTokenRepository.save(refreshToken);
    }

    public void revokeRefreshToken(String token) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(token).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TOKEN_NOT_FOUND"));
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
    }

    public Boolean existsByToken(String token) {
        return refreshTokenRepository.findByToken(token).stream().findFirst().isPresent();
    }
}
