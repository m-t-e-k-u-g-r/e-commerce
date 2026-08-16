package ch.mk.backend.services;

import ch.mk.backend.dtos.LoginRequest;
import ch.mk.backend.dtos.TokenDto;
import ch.mk.backend.entities.RefreshToken;
import ch.mk.backend.entities.User;
import ch.mk.backend.repositories.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;


import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Service
public class AuthService {
    @Autowired
    private JWTService jwtService;
    @Autowired
    private CookieService cookieService;
    @Autowired
    private UserService userService;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private BCryptPasswordEncoder bcryptEncoder;
    @Autowired
    private RefreshService refreshService;

    public ResponseEntity<Void> register(LoginRequest request) {
        try {
            userService.createUser(request.getEmail(), bcryptEncoder.encode(request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<TokenDto> login(LoginRequest request) {
        User user = userService.verifyUser(request);
        Boolean rememberMe = Objects.requireNonNullElse(request.getRememberMe(), false);

        ResponseCookie refreshTokenCookie = cookieService.createRefreshTokenCookie(user, rememberMe);
        ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(user.getId());

        HttpHeaders headers = createHeaders(List.of(refreshTokenCookie.toString(), accessTokenCookie.toString()));

        return ResponseEntity.ok()
                .headers(headers)
                .build();
    }

    public ResponseEntity<TokenDto> refreshAccessToken(String token) {
        byte[] tokenBytes = token.getBytes();
        byte[] hashed = refreshService.generateSHA256Hash(tokenBytes);
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(hashed).stream().findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TOKEN_NOT_FOUND"));

        if (storedToken.getRevoked() || storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN");
        }
        User user = storedToken.getUser();
        boolean rememberMe = Duration.between(storedToken.getExpiresAt(), storedToken.getCreatedAt()).equals(Duration.ofDays(30));

        ResponseCookie refreshTokenCookie = cookieService.createRefreshTokenCookie(user, rememberMe);
        ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(user.getId());

        HttpHeaders headers = createHeaders(List.of(refreshTokenCookie.toString(), accessTokenCookie.toString()));

        refreshService.revokeRefreshToken(hashed);
        return ResponseEntity.ok()
                .headers(headers)
                .build();
    }

    public ResponseEntity<Void> logout(String token) {
        byte[] tokenBytes = token.getBytes();
        byte[] hashed = refreshService.generateSHA256Hash(tokenBytes);
        var dbEntry = refreshTokenRepository.findByTokenHash(hashed);
        if (dbEntry.isPresent()) {
            dbEntry.get().setRevoked(true);
            refreshTokenRepository.save(dbEntry.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var emptyRefreshCookie = cookieService.deleteCookie("refreshToken");
        var emptyAccessTokenCookie = cookieService.deleteCookie("accessToken");

        HttpHeaders headers = createHeaders(List.of(emptyRefreshCookie.toString(), emptyAccessTokenCookie.toString()));

        return ResponseEntity.noContent()
                .headers(headers)
                .build();
    }

    private HttpHeaders createHeaders(List<String> tokens) {
        HttpHeaders headers = new HttpHeaders();
        tokens.forEach(token -> headers.add(HttpHeaders.SET_COOKIE, token));
        return headers;
    }
}
