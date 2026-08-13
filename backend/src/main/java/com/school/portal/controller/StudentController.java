package com.school.portal.controller;

import com.school.portal.models.*;
import com.school.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayOutputStream;
import com.school.portal.dto.MessageResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired UserRepository userRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired AttendanceRepository attendanceRepository;
    @Autowired HomeworkRepository homeworkRepository;
    @Autowired FeeRepository feeRepository;
    @Autowired NoticeRepository noticeRepository;
    @Autowired NotificationRepository notificationRepository;
    @Autowired TimetableRepository timetableRepository;
    @Autowired ExamResultRepository examResultRepository;
    @Autowired StudyMaterialRepository studyMaterialRepository;
    @Autowired LeaveRequestRepository leaveRequestRepository;

    private Optional<Student> getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .flatMap(user -> studentRepository.findByUserId(user.getId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(studentOpt.get());
    }

    @GetMapping("/id-card")
    public ResponseEntity<?> getDigitalIdCard() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        Student student = studentOpt.get();
        Map<String, Object> idCard = new HashMap<>();
        idCard.put("studentName", student.getName());
        idCard.put("studentCode", student.getStudentCode());
        idCard.put("classId", student.getClassId());
        idCard.put("rollNumber", student.getRollNumber() != null ? student.getRollNumber() : "101");
        idCard.put("emergencyContact", "+1 (555) 019-2831");
        idCard.put("validUntil", "2026-12-31");
        idCard.put("schoolName", "SmartSchool International Portal");
        return ResponseEntity.ok(idCard);
    }

    @GetMapping("/homework")
    public ResponseEntity<?> getHomework() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(homeworkRepository.findByClassId(studentOpt.get().getClassId()));
    }

    @GetMapping("/timetable")
    public ResponseEntity<?> getTimetable() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(timetableRepository.findByClassId(studentOpt.get().getClassId()));
    }

    @GetMapping("/exam-results")
    public ResponseEntity<?> getExamResults() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(examResultRepository.findByStudentId(studentOpt.get().getId()));
    }

    @GetMapping("/study-materials")
    public ResponseEntity<?> getStudyMaterials() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(studyMaterialRepository.findByClassId(studentOpt.get().getClassId()));
    }

    @GetMapping("/leave-requests")
    public ResponseEntity<?> getLeaveRequests() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(leaveRequestRepository.findByStudentId(studentOpt.get().getId()));
    }

    @PostMapping("/leave-requests")
    public ResponseEntity<?> applyLeaveRequest(@RequestBody LeaveRequest request) {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        Student student = studentOpt.get();
        request.setStudentId(student.getId());
        request.setStudentName(student.getName());
        request.setClassId(student.getClassId());
        request.setStatus("PENDING");
        request.setAppliedAt(java.time.LocalDate.now().toString());
        LeaveRequest saved = leaveRequestRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendance() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        Student student = studentOpt.get();
        List<Attendance> logs = attendanceRepository.findByStudentId(student.getId());
        long presentCount = logs.stream().filter(l -> "present".equalsIgnoreCase(l.getStatus())).count();
        long total = logs.size();
        double percentage = total == 0 ? 100.0 : ((double) presentCount / total) * 100.0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs);
        response.put("presentCount", presentCount);
        response.put("totalDays", total);
        response.put("percentage", percentage);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/fees")
    public ResponseEntity<?> getFees() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(feeRepository.findByStudentId(studentOpt.get().getId()));
    }

    @GetMapping("/notices")
    public ResponseEntity<?> getNotices() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        List<String> targets = Arrays.asList("all", studentOpt.get().getClassId());
        return ResponseEntity.ok(noticeRepository.findByClassIdIn(targets));
    }
    
    @GetMapping("/notifications")
    public ResponseEntity<?> getMyNotifications() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        return ResponseEntity.ok(notificationRepository.findByUserId(studentOpt.get().getUserId()));
    }

    @PostMapping("/fees/{feeId}/pay")
    public ResponseEntity<?> payFee(@PathVariable String feeId) {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        Student student = studentOpt.get();
        Optional<Fee> feeOpt = feeRepository.findById(feeId);
        if (feeOpt.isPresent()) {
            Fee fee = feeOpt.get();
            if (!fee.getStudentId().equals(student.getId())) return ResponseEntity.badRequest().body("Unauthorized to pay this fee");
            if ("paid".equalsIgnoreCase(fee.getStatus())) return ResponseEntity.badRequest().body("Fee is already paid");
            
            fee.setStatus("paid");
            feeRepository.save(fee);
            
            Notification notif = new Notification(
                student.getUserId(),
                "Fee payment successful for amount: $" + fee.getAmount(),
                java.time.LocalDateTime.now().toString()
            );
            notificationRepository.save(notif);
            return ResponseEntity.ok(new MessageResponse("Fee payment successful!"));
        }
        return ResponseEntity.badRequest().body("Fee record not found");
    }
}
