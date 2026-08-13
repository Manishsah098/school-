package com.school.portal.config;

import com.school.portal.models.*;
import com.school.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired UserRepository userRepository;
    @Autowired StudentRepository studentRepository;
    @Autowired TeacherRepository teacherRepository;
    @Autowired AttendanceRepository attendanceRepository;
    @Autowired HomeworkRepository homeworkRepository;
    @Autowired FeeRepository feeRepository;
    @Autowired NoticeRepository noticeRepository;
    @Autowired TimetableRepository timetableRepository;
    @Autowired ExamResultRepository examResultRepository;
    @Autowired StudyMaterialRepository studyMaterialRepository;
    @Autowired LeaveRequestRepository leaveRequestRepository;
    @Autowired PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        boolean needsSeeding = false;
        if (userRepository.count() == 0) {
            needsSeeding = true;
        } else {
            java.util.Optional<User> adminOpt = userRepository.findByEmail("admin@school.com");
            if (adminOpt.isEmpty() || !adminOpt.get().getPassword().startsWith("$2")) {
                System.out.println("Existing database users found, but passwords are not BCrypt encoded. Re-seeding database...");
                needsSeeding = true;
                
                userRepository.deleteAll();
                studentRepository.deleteAll();
                teacherRepository.deleteAll();
                attendanceRepository.deleteAll();
                homeworkRepository.deleteAll();
                feeRepository.deleteAll();
                noticeRepository.deleteAll();
                timetableRepository.deleteAll();
                examResultRepository.deleteAll();
                studyMaterialRepository.deleteAll();
                leaveRequestRepository.deleteAll();
            }
        }

        if (needsSeeding) {
            System.out.println("No users found in MongoDB. Pre-populating default seed data...");

            // 1. Create Admins
            User adminUser = new User("Principal Staff", "admin@school.com", encoder.encode("Admin@123"), "admin");
            userRepository.save(adminUser);

            // 2. Create Teachers
            User teacherUser = new User("David Kumar", "teacher@school.com", encoder.encode("Teacher@123"), "teacher");
            userRepository.save(teacherUser);
            Teacher teacherObj = new Teacher("David Kumar", "T.8821", "Physics", teacherUser.getId(), "Grade 10 - A");
            teacherRepository.save(teacherObj);

            // 3. Create Students
            User studentUser = new User("Krish Kumar Sah", "student@school.com", encoder.encode("Student@123"), "student");
            userRepository.save(studentUser);
            Student studentObj = new Student(
                    "Krish Kumar Sah", "S.3183", "Krish Kumar Sah Sr.", 
                    studentUser.getId(), "Grade 10 - A", "2010-05-12", "O+ve", "+977 9801234567"
            );
            studentRepository.save(studentObj);

            User sibling1User = new User("Rohan Kumar Sah", "rohan@school.com", encoder.encode("Student@123"), "student");
            userRepository.save(sibling1User);
            Student sibling1 = new Student("Rohan Kumar Sah", "S.3184", "Krish Kumar Sah Sr.", sibling1User.getId(), "Grade 8 - B", "2012-08-15", "O+ve", "+977 9801234567");
            studentRepository.save(sibling1);

            // 4. Attendance logs
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-13", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-14", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-15", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-16", "absent"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-17", "present"));

            // 5. Homework Assignments
            homeworkRepository.save(new Homework(teacherObj.getId(), "Thermodynamics Lab Report", "Draft lab readings and complete assignment questions 1-5 from Chapter 6.", "Grade 10 - A", "2026-07-22"));
            homeworkRepository.save(new Homework(teacherObj.getId(), "Light Waves Equation solving", "Complete worksheets distributed in class yesterday.", "Grade 10 - A", "2026-07-20"));

            // 6. Notices
            noticeRepository.save(new Notice("Terminal Exam Schedule Published", "Term exams start from August 5. Timetable can be picked from office desk.", "all", "2026-07-19"));
            noticeRepository.save(new Notice("Sports Day Signups", "Register your athletics events interest on physical forms before July 25.", "all", "2026-07-18"));

            // 7. Fees
            feeRepository.save(new Fee(studentObj.getId(), 25000.0, "paid", "2026-06-01"));
            feeRepository.save(new Fee(studentObj.getId(), 25000.0, "pending", "2026-07-01"));

            // 8. Timetable Routine
            timetableRepository.save(new Timetable("Grade 10 - A", "Monday", 1, "Physics", "David Kumar", "09:00 AM", "09:45 AM"));
            timetableRepository.save(new Timetable("Grade 10 - A", "Monday", 2, "Mathematics", "Sarah Jenkins", "09:45 AM", "10:30 AM"));
            timetableRepository.save(new Timetable("Grade 10 - A", "Monday", 3, "Chemistry", "Robert Smith", "10:45 AM", "11:30 AM"));
            timetableRepository.save(new Timetable("Grade 10 - A", "Tuesday", 1, "English Literature", "Emily Brown", "09:00 AM", "09:45 AM"));
            timetableRepository.save(new Timetable("Grade 10 - A", "Tuesday", 2, "Physics Lab", "David Kumar", "09:45 AM", "11:30 AM"));

            // 9. Exam Results
            examResultRepository.save(new ExamResult(studentObj.getId(), "Krish Kumar Sah", "Grade 10 - A", "Mid-Term Examination", "Physics", 92, 100, "A+", "2026-06-15"));
            examResultRepository.save(new ExamResult(studentObj.getId(), "Krish Kumar Sah", "Grade 10 - A", "Mid-Term Examination", "Mathematics", 88, 100, "A", "2026-06-16"));
            examResultRepository.save(new ExamResult(studentObj.getId(), "Krish Kumar Sah", "Grade 10 - A", "Mid-Term Examination", "Chemistry", 95, 100, "A+", "2026-06-17"));

            // 10. Study Materials
            studyMaterialRepository.save(new StudyMaterial("Quantum Optics Handout PDF", "Physics", "Grade 10 - A", "Complete lecture notes on photon waves and diffraction formulas.", "https://example.com/notes/optics.pdf", "David Kumar", "2026-07-10"));
            studyMaterialRepository.save(new StudyMaterial("Trigonometry Formula Sheet", "Mathematics", "Grade 10 - A", "Quick reference guide for trigonometric identities.", "https://example.com/notes/trig.pdf", "Sarah Jenkins", "2026-07-12"));

            // 11. Leave Requests
            leaveRequestRepository.save(new LeaveRequest(studentObj.getId(), "Krish Kumar Sah", "Grade 10 - A", "2026-07-28", "2026-07-30", "Family event out of station", "APPROVED", "2026-07-20"));

            System.out.println("MongoDB database populated successfully with Smart School mock records!");
        } else {
            // Check if extra collections need seed data
            if (timetableRepository.count() == 0) {
                timetableRepository.save(new Timetable("Grade 10 - A", "Monday", 1, "Physics", "David Kumar", "09:00 AM", "09:45 AM"));
                timetableRepository.save(new Timetable("Grade 10 - A", "Monday", 2, "Mathematics", "Sarah Jenkins", "09:45 AM", "10:30 AM"));
                timetableRepository.save(new Timetable("Grade 10 - A", "Tuesday", 1, "English Literature", "Emily Brown", "09:00 AM", "09:45 AM"));
            }
            if (examResultRepository.count() == 0) {
                examResultRepository.save(new ExamResult("ANY", "Krish Kumar Sah", "Grade 10 - A", "Mid-Term Examination", "Physics", 92, 100, "A+", "2026-06-15"));
            }
            if (studyMaterialRepository.count() == 0) {
                studyMaterialRepository.save(new StudyMaterial("Quantum Optics Handout PDF", "Physics", "Grade 10 - A", "Complete lecture notes on photon waves and diffraction formulas.", "https://example.com/notes/optics.pdf", "David Kumar", "2026-07-10"));
            }
        }
    }
}
