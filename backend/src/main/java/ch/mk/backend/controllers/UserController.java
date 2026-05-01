package ch.mk.backend.controllers;

import ch.mk.backend.dtos.EditUserDto;
import ch.mk.backend.dtos.UserDto;
import ch.mk.backend.entities.User;
import ch.mk.backend.mappers.UserMapper;
import ch.mk.backend.repositories.UserRepository;
import ch.mk.backend.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getUser(
            @AuthenticationPrincipal User user
    ) {
        try {
            return userRepository.findById(user.getId())
                    .map(userMapper::toDto)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> editUser(
            @AuthenticationPrincipal User user,
            @RequestBody EditUserDto userDto
    ) {
        UserDto updatedUser = userService.editUser(user, userDto);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}
