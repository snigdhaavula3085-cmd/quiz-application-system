package com.example.backend;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public UserDataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        ensureUser("admin", "admin123", "ADMIN");
        ensureUser("snigdha_30", "pass123", "USER");
        ensureUser("testuser", "testpass123", "USER");
    }

    private void ensureUser(String username, String password, String role) {
        userRepository.findByUsername(username).ifPresentOrElse(
            user -> {
                user.setPassword(password); // Update password to known one for consistency
                user.setRole(role);
                userRepository.save(user);
            },
            () -> {
                userRepository.save(new User(username, password, role));
            }
        );
    }
}
