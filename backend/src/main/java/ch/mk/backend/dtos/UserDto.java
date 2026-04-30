package ch.mk.backend.dtos;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
    private String lastLogin;
}
