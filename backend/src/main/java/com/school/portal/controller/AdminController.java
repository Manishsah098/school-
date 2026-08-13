package com.school.portal.controller;

import com.school.portal.models.*;
import com.school.portal.repository.*;
import com.school.portal.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired StudentRepository studentRepository;
    @Autowired TeacherRepository teacherRepository;
    @Autowired HomeworkRepository homeworkRepository;
    @Autowired FeeRepository feeRepository;
    @Autowired NoticeRepository noticeRepository;
    @Autowired UserRepository userRepository;
    @Autowired TimetableRepository timetableRepository;
    @Autowired ExamResultRepository examResultRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long activeHomework = homeworkRepository.count();
        
        List<Fee> fees = feeRepository.findAll();
        double paidFees = 0;
        double pendingFees = 0;
        
        for (Fee f : fees) {
            if ("paid".equalsIgnoreCase(f.getStatus())) {
                paidFees += f.getAmount();
            } else {
                pendingFees += f.getAmount();
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalTeachers", totalTeachers);
        stats.put("activeHomework", activeHomework);
        stats.put("feesPaid", paidFees);
        stats.put("feesPending", pendingFees);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/students")
    public List<Student> getStudents() {
        return studentRepository.findAll();
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        studentRepository.findById(id).ifPresent(student -> {
            userRepository.deleteById(student.getUserId());
            studentRepository.deleteById(id);
        });
        return ResponseEntity.ok(new MessageResponse("Student deleted successfully!"));
    }

    @GetMapping("/teachers")
    public List<Teacher> getTeachers() {
        return teacherRepository.findAll();
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable String id) {
        teacherRepository.findById(id).ifPresent(teacher -> {
            userRepository.deleteById(teacher.getUserId());
            teacherRepository.deleteById(id);
        });
        return ResponseEntity.ok(new MessageResponse("Teacher deleted successfully!"));
    }

    @GetMapping("/fees")
    public List<Fee> getFees() {
        return feeRepository.findAll();
    }

    @PostMapping("/fees")
    public ResponseEntity<?> assignFee(@RequestBody Fee fee) {
        if (fee.getDate() == null || fee.getDate().isEmpty()) {
            fee.setDate(java.time.LocalDate.now().toString());
        }
        if (fee.getStatus() == null || fee.getStatus().isEmpty()) {
            fee.setStatus("pending");
        }
        Fee saved = feeRepository.save(fee);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/fees/{id}/pay")
    public ResponseEntity<?> markFeePaid(@PathVariable String id) {
        feeRepository.findById(id).ifPresent(fee -> {
            fee.setStatus("paid");
            feeRepository.save(fee);
        });
        return ResponseEntity.ok(new MessageResponse("Fee payment marked successfully!"));
    }

    @GetMapping("/timetable")
    public List<Timetable> getTimetables() {
        return timetableRepository.findAll();
    }

    @PostMapping("/timetable")
    public ResponseEntity<?> createTimetableSlot(@RequestBody Timetable slot) {
        Timetable saved = timetableRepository.save(slot);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/notices")
    public ResponseEntity<?> createNotice(@RequestBody Notice notice) {
        if (notice.getCreatedAt() == null || notice.getCreatedAt().isEmpty()) {
            notice.setCreatedAt(java.time.LocalDate.now().toString());
        }
        noticeRepository.save(notice);
        return ResponseEntity.ok(new MessageResponse("Notice broadcasted successfully!"));
    }
}
