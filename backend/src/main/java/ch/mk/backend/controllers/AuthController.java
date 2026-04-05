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

    private String refreshAccessToken(String token) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        if (storedToken.getRevoked() || storedToken.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token is invalid or expired");
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
