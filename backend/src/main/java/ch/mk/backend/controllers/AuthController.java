package ch.mk.backend.controllers;

import ch.mk.backend.dtos.LoginRequest;
import ch.mk.backend.dtos.TokenDto;
import ch.mk.backend.services.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> registerUser(@RequestBody LoginRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> loginUser(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        return authService.refreshAccessToken(refreshToken);
    }

    @DeleteMapping("/logout")
    public ResponseEntity<Void> logoutUser(@CookieValue("refreshToken") String refreshToken) {
        return authService.logout(refreshToken);
    }
}
