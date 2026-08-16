package ch.mk.backend.services;

import ch.mk.backend.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class CookieService {
    @Autowired
    private JWTService jwtService;
    @Autowired
    private RefreshService refreshService;

    public ResponseCookie createAccessTokenCookie(UUID userId) {
        String token = jwtService.generateAccessToken(userId);
        return ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(600)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie createRefreshTokenCookie(User user, Boolean isRememberMe) {
        byte[] tokenBytes = refreshService.generateRefreshToken();
        refreshService.saveRefreshToken(tokenBytes, user, isRememberMe);
        int maxAge = isRememberMe
                ? 30 * jwtService.MilliToDays / 1000
                : 7 * jwtService.MilliToDays / 1000;

        String token = new String(tokenBytes, StandardCharsets.UTF_8);
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie deleteCookie(String cookieName) {
        return ResponseCookie.from(cookieName, null)
                .path("/")
                .maxAge(0)
                .build();
    }
}
