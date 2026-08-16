package ch.mk.backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;

@Service
public class JWTService {
    @Autowired
    private SecretsService secretsService;
    public Integer MilliToDays = 24 * 60 * 60 * 1000;
    public Integer MilliToMinutes = 60 * 1000;

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
}
