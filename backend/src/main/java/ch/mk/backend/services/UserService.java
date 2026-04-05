package ch.mk.backend.services;

import ch.mk.backend.dtos.LoginRequest;
import ch.mk.backend.entities.RefreshToken;
import ch.mk.backend.entities.User;
import ch.mk.backend.repositories.RefreshTokenRepository;
import ch.mk.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public void createUser(String email, String password_hash) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(password_hash);

        userRepository.save(user);
    }

    public String verifyUser(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        if (authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String tokenString = jwtService.generateRefreshToken(user.getId().toString());
            saveRefreshToken(tokenString, user);
            return tokenString;
        }
        return null;
    }

    private void saveRefreshToken(String tokenString, User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(tokenString);
        refreshToken.setRevoked(false);
        refreshToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));

        refreshTokenRepository.save(refreshToken);
    }
}
