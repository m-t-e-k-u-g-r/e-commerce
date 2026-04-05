package ch.mk.backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTService {
    @Value("${jwt.refresh-token-secret}")
    private String refreshTokenSecret;
    @Value("${jwt.access-token-secret}")
    private String accessTokenSecret;

    public String generateAccessToken(String userId) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
                .and()
                .signWith(getAccessTokenKey())
                .compact();
    }

    public String createAccessTokenFromRefreshToken(String refreshToken) {
        Jws<Claims> claims = checkRefreshToken(refreshToken);
        String userId = claims.getPayload().getSubject();
        return generateAccessToken(userId);
    }

    public String generateRefreshToken(String userId) {
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000))
                .and()
                .signWith(getRefreshTokenKey())
                .compact();
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
        byte[] keyBytes = Decoders.BASE64.decode(accessTokenSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getRefreshTokenKey() {
        byte[] keyBytes = Decoders.BASE64.decode(refreshTokenSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
