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

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    HomeworkRepository homeworkRepository;

    @Autowired
    FeeRepository feeRepository;

    @Autowired
    NoticeRepository noticeRepository;
    
    @Autowired
    NotificationRepository notificationRepository;

    private Optional<Student> getCurrentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .flatMap(user -> studentRepository.findByUserId(user.getId()));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        return ResponseEntity.ok(studentOpt.get());
    }

    @GetMapping("/homework")
    public ResponseEntity<?> getHomework() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        return ResponseEntity.ok(homeworkRepository.findByClassId(studentOpt.get().getClassId()));
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendance() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
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
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        return ResponseEntity.ok(feeRepository.findByStudentId(studentOpt.get().getId()));
    }

    @GetMapping("/notices")
    public ResponseEntity<?> getNotices() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        List<String> targets = Arrays.asList("all", studentOpt.get().getClassId());
        return ResponseEntity.ok(noticeRepository.findByClassIdIn(targets));
    }
    
    @GetMapping("/notifications")
    public ResponseEntity<?> getMyNotifications() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        return ResponseEntity.ok(notificationRepository.findByUserId(studentOpt.get().getUserId()));
    }

    @PostMapping("/fees/{feeId}/pay")
    public ResponseEntity<?> payFee(@PathVariable String feeId) {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student profile not found");
        }
        Student student = studentOpt.get();
        Optional<Fee> feeOpt = feeRepository.findById(feeId);
        if (feeOpt.isPresent()) {
            Fee fee = feeOpt.get();
            if (!fee.getStudentId().equals(student.getId())) {
                return ResponseEntity.badRequest().body("Unauthorized to pay this fee");
            }
            if ("paid".equalsIgnoreCase(fee.getStatus())) {
                return ResponseEntity.badRequest().body("Fee is already paid");
            }
            
            fee.setStatus("paid");
            feeRepository.save(fee);
            
            // Create Notification
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

    @GetMapping("/fees/{feeId}/receipt")
    public ResponseEntity<?> downloadReceipt(@PathVariable String feeId) {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");
        
        Student student = studentOpt.get();
        Optional<Fee> feeOpt = feeRepository.findById(feeId);
        
        if (feeOpt.isEmpty() || !feeOpt.get().getStudentId().equals(student.getId())) {
            return ResponseEntity.badRequest().body("Fee record not found or unauthorized");
        }
        
        Fee fee = feeOpt.get();
        if (!"paid".equalsIgnoreCase(fee.getStatus())) {
            return ResponseEntity.badRequest().body("Cannot generate receipt for unpaid fee");
        }
        
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            
            document.open();
            document.add(new Paragraph("School Portal - Fee Receipt"));
            document.add(new Paragraph("-----------------------------------"));
            document.add(new Paragraph("Receipt ID: " + fee.getId()));
            document.add(new Paragraph("Date: " + fee.getDate()));
            document.add(new Paragraph("Student Name: " + student.getName()));
            document.add(new Paragraph("Student Code: " + student.getStudentCode()));
            document.add(new Paragraph("Amount Paid: $" + fee.getAmount()));
            document.add(new Paragraph("Status: PAID"));
            document.add(new Paragraph("-----------------------------------"));
            document.add(new Paragraph("Thank you for your payment!"));
            document.close();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Receipt_" + fee.getId() + ".pdf");
            
            return ResponseEntity.ok().headers(headers).body(out.toByteArray());
        } catch (DocumentException e) {
            return ResponseEntity.internalServerError().body("Error generating PDF receipt");
        }
    }
}
