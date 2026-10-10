package com.smartcanteen.service;

import com.smartcanteen.dto.AuthRequest;
import com.smartcanteen.dto.AuthResponse;
import com.smartcanteen.dto.RegisterRequest;
import com.smartcanteen.exception.BadRequestException;
import com.smartcanteen.model.Role;
import com.smartcanteen.model.User;
import com.smartcanteen.repository.UserRepository;
import com.smartcanteen.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User studentUser;

    @BeforeEach
    void setUp() {
        studentUser = User.builder()
                .id("user-101")
                .name("Soujith G")
                .email("student@canteen.com")
                .password("encoded_pass")
                .role(Role.STUDENT)
                .universityId("STU202401")
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register new user and return JWT token")
    void testRegisterSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Soujith G")
                .email("student@canteen.com")
                .password("password123")
                .role(Role.STUDENT)
                .universityId("STU202401")
                .build();

        when(userRepository.existsByEmail("student@canteen.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(studentUser);
        when(tokenProvider.generateTokenFromUser(anyString(), anyString(), anyString(), anyString()))
                .thenReturn("mock_jwt_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("student@canteen.com", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration if email already exists")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Soujith G")
                .email("student@canteen.com")
                .password("password123")
                .role(Role.STUDENT)
                .build();

        when(userRepository.existsByEmail("student@canteen.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() {
        AuthRequest request = new AuthRequest("student@canteen.com", "password123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock_jwt_token");
        when(userRepository.findByEmail("student@canteen.com")).thenReturn(Optional.of(studentUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("Soujith G", response.getName());
    }
}
