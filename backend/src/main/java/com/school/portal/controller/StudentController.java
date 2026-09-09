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

    @GetMapping("/library/books")
    public ResponseEntity<?> getLibraryBooks() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");

        List<Map<String, Object>> books = Arrays.asList(
            createBook("b1", "Concepts of Modern Physics", "Arthur Beiser", "Science", "978-0072448481", "Rack S-04", "4.8", "AVAILABLE", true, "#0284C7", "⚛️", "A comprehensive study of quantum mechanics, relativity, atomic structure, and particle physics.", "Chapter 1: Special Relativity\n\n1.1 Galilean Relativity\nIn classical mechanics, the laws of physics are assumed to be identical in all inertial frames of reference...\n\n1.2 Postulates of Einstein\n1. The laws of physics are the same in all inertial reference frames.\n2. The speed of light in vacuum has the same value c in all inertial frames.\n\n1.3 Time Dilation\nMoving clocks run slower by factor gamma = 1 / sqrt(1 - v^2/c^2)."),
            createBook("b2", "Advanced Engineering Mathematics", "Erwin Kreyszig", "Mathematics", "978-0470458365", "Rack M-12", "4.9", "BORROWED", true, "#7C3AED", "📐", "Comprehensive guide covering differential equations, linear algebra, complex analysis, and numerical methods.", "Chapter 4: Linear Algebra and Matrices\n\n4.1 Systems of Linear Equations\nA system of m linear equations in n unknowns can be represented concisely as Ax = b...\n\n4.2 Eigenvalues and Eigenvectors\nLet A be an n x n matrix. A non-zero vector v is an eigenvector if Av = lambda * v."),
            createBook("b3", "To Kill a Mockingbird", "Harper Lee", "Literature", "978-0061120084", "Rack L-02", "4.9", "AVAILABLE", true, "#D97706", "📖", "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.", "Part One\n\nChapter 1\nWhen he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem's fears of never being able to play football were assuaged, he was seldom self-conscious about his injury..."),
            createBook("b4", "Introduction to Algorithms (CLRS)", "Cormen, Leiserson, Rivest, Stein", "Technology", "978-0262033848", "Rack CS-01", "5.0", "BORROWED", true, "#059669", "💻", "The standard textbook on modern computer algorithms covering dynamic programming, graph theory, and greedy heuristics.", "Chapter 2: Getting Started\n\n2.1 Insertion Sort\nInsertion sort is an efficient algorithm for sorting a small number of elements. It works the way many people sort a hand of playing cards...\n\nAlgorithm Complexity: O(n^2) worst case, O(n) best case."),
            createBook("b5", "World History: Patterns of Interaction", "Roger B. Beck", "History", "978-0547491127", "Rack H-09", "4.6", "AVAILABLE", false, "#DC2626", "🏛️", "Exploring the rich tapestry of world civilizations from early river valley societies to modern geopolitical movements.", ""),
            createBook("b6", "Organic Chemistry: Structure & Function", "K. Peter C. Vollhardt", "Science", "978-1464120275", "Rack S-11", "4.7", "AVAILABLE", true, "#0891B2", "🧪", "Explains chemical mechanisms, stereochemistry, and biochemical pathways with real-world applications.", "Chapter 3: Alkanes and Conformations\n\n3.1 Structure of Methane and Ethane\nThe carbon atoms in alkanes are sp3 hybridized, forming tetrahedral geometries with bond angles of ~109.5 degrees...")
        );
        return ResponseEntity.ok(books);
    }

    private Map<String, Object> createBook(String id, String title, String author, String category, String isbn, String shelf, String rating, String status, boolean isEbook, String coverColor, String coverIcon, String summary, String ebookContent) {
        Map<String, Object> b = new HashMap<>();
        b.put("id", id);
        b.put("title", title);
        b.put("author", author);
        b.put("category", category);
        b.put("isbn", isbn);
        b.put("shelf", shelf);
        b.put("rating", rating);
        b.put("status", status);
        b.put("isEbook", isEbook);
        b.put("coverColor", coverColor);
        b.put("coverIcon", coverIcon);
        b.put("summary", summary);
        b.put("ebookContent", ebookContent);
        return b;
    }

    @GetMapping("/library/my-issued")
    public ResponseEntity<?> getMyIssuedBooks() {
        Optional<Student> studentOpt = getCurrentStudent();
        if (studentOpt.isEmpty()) return ResponseEntity.badRequest().body("Student profile not found");

        List<Map<String, Object>> issued = Arrays.asList(
            createIssued("iss-1", "b2", "Advanced Engineering Mathematics", "Erwin Kreyszig", "📐", "#7C3AED", "2026-09-01", "2026-09-18", 2, "ACTIVE"),
            createIssued("iss-2", "b4", "Introduction to Algorithms (CLRS)", "Cormen, Leiserson, Rivest, Stein", "💻", "#059669", "2026-08-25", "2026-09-12", 1, "ACTIVE")
        );
        return ResponseEntity.ok(issued);
    }

    private Map<String, Object> createIssued(String id, String bookId, String title, String author, String coverIcon, String coverColor, String issueDate, String dueDate, int renewalsLeft, String status) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("bookId", bookId);
        item.put("title", title);
        item.put("author", author);
        item.put("coverIcon", coverIcon);
        item.put("coverColor", coverColor);
        item.put("issueDate", issueDate);
        item.put("dueDate", dueDate);
        item.put("renewalsLeft", renewalsLeft);
        item.put("status", status);
        return item;
    }
}
