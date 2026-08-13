package com.school.portal.controller;

import com.school.portal.dto.*;
import com.school.portal.models.Student;
import com.school.portal.models.Teacher;
import com.school.portal.models.User;
import com.school.portal.repository.StudentRepository;
import com.school.portal.repository.TeacherRepository;
import com.school.portal.repository.UserRepository;
import com.school.portal.security.JwtUtils;
import com.school.portal.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping({"/signin", "/login"})
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").toLowerCase();

        return ResponseEntity.ok(new JwtResponse(jwt,
                                                 userDetails.getId(),
                                                 userDetails.getName(),
                                                 userDetails.getEmail(),
                                                 role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getName(),
                             signUpRequest.getEmail(),
                             encoder.encode(signUpRequest.getPassword()),
                             signUpRequest.getRole());

        userRepository.save(user);

        // Role-based profile linkage
        String role = signUpRequest.getRole().toLowerCase();
        if (role.equals("student")) {
            Student student = new Student(
                    signUpRequest.getName(),
                    signUpRequest.getStudentCode(),
                    signUpRequest.getParentName(),
                    user.getId(),
                    signUpRequest.getClassId(),
                    signUpRequest.getDob(),
                    signUpRequest.getBloodGroup(),
                    signUpRequest.getPhone()
            );
            studentRepository.save(student);
        } else if (role.equals("teacher")) {
            Teacher teacher = new Teacher(
                    signUpRequest.getName(),
                    signUpRequest.getTeacherCode(),
                    signUpRequest.getSubject(),
                    user.getId(),
                    signUpRequest.getClassId()
            );
            teacherRepository.save(teacher);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
