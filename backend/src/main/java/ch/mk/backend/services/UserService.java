package ch.mk.backend.services;

import ch.mk.backend.dtos.ChangePasswordDto;
import ch.mk.backend.dtos.EditUserDto;
import ch.mk.backend.dtos.LoginRequest;
import ch.mk.backend.dtos.UserDto;
import ch.mk.backend.entities.User;
import ch.mk.backend.mappers.UserMapper;
import ch.mk.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private BCryptPasswordEncoder bcryptEncoder;

    public void createUser(String email, String password_hash) {
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(password_hash);

        userRepository.save(user);
    }

    public UserDto editUser(User user, EditUserDto dto) {
        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "EMAIL_EMPTY");
        }
        user.setEmail(dto.getEmail());
        if (dto.getForename() != null) {
            user.setForename(dto.getForename());
            if (dto.getForename().isEmpty()) user.setForename(null);
        }
        if (dto.getSurname() != null) {
            user.setSurname(dto.getSurname());
            if (dto.getSurname().isEmpty()) user.setSurname(null);
        }
        userRepository.save(user);
        return userMapper.toDto(user);
    }

    public void changePassword(User user, ChangePasswordDto dto) {
        boolean oldPasswordCorrect = bcryptEncoder.matches(dto.getOldPassword(), user.getPasswordHash());
        if (!oldPasswordCorrect) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD");

        boolean samePassword = bcryptEncoder.matches(dto.getNewPassword(), user.getPasswordHash());
        if (samePassword) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SAME_PASSWORD");

        user.setPasswordHash(bcryptEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    public User verifyUser(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        if (authentication.isAuthenticated()) {
            return userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "NOT_AUTHENTICATED");
        }
    }
}
