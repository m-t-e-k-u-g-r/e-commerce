package ch.mk.backend.dtos;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@AllArgsConstructor
@Getter
@Setter
public class UserDto {
    private Integer id;
    private String email;
    @Nullable
    private String forename;
    @Nullable
    private String surname;
    private Instant lastLogin;
}
