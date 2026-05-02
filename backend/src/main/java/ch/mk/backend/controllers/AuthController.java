package ch.mk.backend.controllers;

import ch.mk.backend.dtos.LoginRequest;
import ch.mk.backend.dtos.TokenDto;
import ch.mk.backend.entities.RefreshToken;
import ch.mk.backend.repositories.RefreshTokenRepository;
import ch.mk.backend.services.CookieService;
import ch.mk.backend.services.JWTService;
import ch.mk.backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bcryptEncoder;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private CookieService cookieService;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/register")
    public ResponseEntity<TokenDto> registerUser(@RequestBody LoginRequest request) {
        request.setRememberMe(false);
        try {
            userService.createUser(request.getEmail(), bcryptEncoder.encode(request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        String refreshToken = userService.verifyUser(request);
        return createAuthResponse(refreshToken);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> loginUser(@RequestBody LoginRequest request) {
        if (request.getRememberMe() == null) request.setRememberMe(false);
        String refreshToken = userService.verifyUser(request);
        return createAuthResponse(refreshToken);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refreshToken(
            @CookieValue("refreshToken") String refreshToken
    ) {
        try {
            String newAccessToken = refreshAccessToken(refreshToken);
            ResponseCookie cookie = cookieService.createAccessTokenCookie(newAccessToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logoutUser(
            @CookieValue("refreshToken") String refreshToken
    ) {
        var dbEntry = refreshTokenRepository.findByToken(refreshToken);
        if (dbEntry.isPresent()) {
            dbEntry.get().setRevoked(true);
            refreshTokenRepository.save(dbEntry.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        var emptyRefreshCookie = cookieService.deleteCookie("refreshToken");
        var emptyAccessTokenCookie = cookieService.deleteCookie("accessToken");

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, emptyRefreshCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, emptyAccessTokenCookie.toString());

        return ResponseEntity.noContent()
                .headers(headers)
                .build();
    }

    private String refreshAccessToken(String token) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TOKEN_NOT_FOUND"));

        if (storedToken.getRevoked() || storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN");
        }
        return jwtService.createAccessTokenFromRefreshToken(token);
    }

    private ResponseEntity<TokenDto> createAuthResponse(String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ResponseCookie refreshTokenCookie = cookieService.createRefreshTokenCookie(refreshToken);
        String accessToken = jwtService.createAccessTokenFromRefreshToken(refreshToken);
        ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(accessToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .build();
    }
}
