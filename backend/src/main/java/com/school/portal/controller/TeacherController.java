package com.school.portal.controller;

import com.school.portal.models.*;
import com.school.portal.repository.*;
import com.school.portal.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    HomeworkRepository homeworkRepository;

    @Autowired
    NoticeRepository noticeRepository;

    @Autowired
    NotificationRepository notificationRepository;

    private Optional<Teacher> getCurrentTeacher() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .flatMap(user -> teacherRepository.findByUserId(user.getId()));
    }

    @GetMapping("/classes")
    public ResponseEntity<?> getAssignedClasses() {
        Optional<Teacher> teacherOpt = getCurrentTeacher();
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher profile not found");
        }
        return ResponseEntity.ok(Collections.singletonList(teacherOpt.get().getClassId()));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getMyStudents() {
        Optional<Teacher> teacherOpt = getCurrentTeacher();
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher profile not found");
        }
        return ResponseEntity.ok(studentRepository.findByClassId(teacherOpt.get().getClassId()));
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> markAttendance(@RequestBody List<Attendance> attendanceList) {
        for (Attendance att : attendanceList) {
            // Find if attendance log already exists for this date and student, update it, else create
            List<Attendance> existing = attendanceRepository.findByStudentIdAndDate(att.getStudentId(), att.getDate());
            if (!existing.isEmpty()) {
                Attendance existingAtt = existing.get(0);
                existingAtt.setStatus(att.getStatus());
                attendanceRepository.save(existingAtt);
            } else {
                attendanceRepository.save(att);
            }
            
            // Generate Notification for the Parent (Student's User Account)
            Optional<Student> studentOpt = studentRepository.findById(att.getStudentId());
            if (studentOpt.isPresent()) {
                Student student = studentOpt.get();
                String message = "Your child is " + att.getStatus() + " today (" + att.getDate() + ").";
                Notification notif = new Notification(
                    student.getUserId(),
                    message,
                    java.time.LocalDateTime.now().toString()
                );
                notificationRepository.save(notif);
            }
        }
        return ResponseEntity.ok(new MessageResponse("Attendance submitted successfully!"));
    }

    @PostMapping("/homework")
    public ResponseEntity<?> uploadHomework(@RequestBody Homework homework) {
        Optional<Teacher> teacherOpt = getCurrentTeacher();
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher profile not found");
        }
        Teacher teacher = teacherOpt.get();
        homework.setTeacherId(teacher.getId());
        homework.setClassId(teacher.getClassId());
        if (homework.getDate() == null || homework.getDate().isEmpty()) {
            homework.setDate(java.time.LocalDate.now().toString());
        }
        homeworkRepository.save(homework);
        return ResponseEntity.ok(new MessageResponse("Homework uploaded successfully!"));
    }

    @GetMapping("/homework")
    public ResponseEntity<?> getMyHomework() {
        Optional<Teacher> teacherOpt = getCurrentTeacher();
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher profile not found");
        }
        return ResponseEntity.ok(homeworkRepository.findByTeacherId(teacherOpt.get().getId()));
    }

    @PostMapping("/notices")
    public ResponseEntity<?> createClassNotice(@RequestBody Notice notice) {
        Optional<Teacher> teacherOpt = getCurrentTeacher();
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher profile not found");
        }
        Teacher teacher = teacherOpt.get();
        notice.setClassId(teacher.getClassId());
        if (notice.getCreatedAt() == null || notice.getCreatedAt().isEmpty()) {
            notice.setCreatedAt(java.time.LocalDate.now().toString());
        }
        noticeRepository.save(notice);
        return ResponseEntity.ok(new MessageResponse("Notice posted to class successfully!"));
    }
}
