package ch.mk.backend.dtos;

import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    @Nullable
    private Boolean rememberMe;
}
