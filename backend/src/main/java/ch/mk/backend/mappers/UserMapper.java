package ch.mk.backend.mappers;

import ch.mk.backend.dtos.UserDto;
import ch.mk.backend.entities.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toDto(User user);
}
