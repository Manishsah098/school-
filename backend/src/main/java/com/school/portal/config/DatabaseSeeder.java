package com.school.portal.config;

import com.school.portal.models.*;
import com.school.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    TeacherRepository teacherRepository;

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    HomeworkRepository homeworkRepository;

    @Autowired
    FeeRepository feeRepository;

    @Autowired
    NoticeRepository noticeRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        // Run seed check
        boolean needsSeeding = false;
        if (userRepository.count() == 0) {
            needsSeeding = true;
        } else {
            java.util.Optional<User> adminOpt = userRepository.findByEmail("admin@school.com");
            if (adminOpt.isEmpty() || !adminOpt.get().getPassword().startsWith("$2")) {
                System.out.println("Existing database users found, but passwords are not BCrypt encoded (possibly seeded by Node.js). Re-seeding database...");
                needsSeeding = true;
                
                // Clear existing old/incompatible data to prevent constraints/unique index collisions
                userRepository.deleteAll();
                studentRepository.deleteAll();
                teacherRepository.deleteAll();
                attendanceRepository.deleteAll();
                homeworkRepository.deleteAll();
                feeRepository.deleteAll();
                noticeRepository.deleteAll();
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
                    "Krish Kumar Sah", 
                    "S.3183", 
                    "Krish Kumar Sah Sr.", 
                    studentUser.getId(), 
                    "Grade 10 - A", 
                    "2010-05-12", 
                    "O+ve", 
                    "+977 9801234567"
            );
            studentRepository.save(studentObj);

            // Add siblings for Krish (in-memory references on frontend, but we can seed extra student users for complete records!)
            User sibling1User = new User("Rohan Kumar Sah", "rohan@school.com", encoder.encode("Student@123"), "student");
            userRepository.save(sibling1User);
            Student sibling1 = new Student("Rohan Kumar Sah", "S.3184", "Krish Kumar Sah Sr.", sibling1User.getId(), "Grade 8 - B", "2012-08-15", "O+ve", "+977 9801234567");
            studentRepository.save(sibling1);

            User sibling2User = new User("Anjali Sah", "anjali@school.com", encoder.encode("Student@123"), "student");
            userRepository.save(sibling2User);
            Student sibling2 = new Student("Anjali Sah", "S.3522", "Krish Kumar Sah Sr.", sibling2User.getId(), "Grade 5 - A", "2015-11-20", "B+ve", "+977 9801234567");
            studentRepository.save(sibling2);

            // 4. Create Attendance logs (Present/Absent ratio to test analytics)
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-13", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-14", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-15", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-16", "absent"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-17", "present"));
            attendanceRepository.save(new Attendance(studentObj.getId(), "2026-07-18", "present"));
            
            // Siblings attendance
            attendanceRepository.save(new Attendance(sibling1.getId(), "2026-07-17", "present"));
            attendanceRepository.save(new Attendance(sibling2.getId(), "2026-07-17", "absent"));

            // 5. Create Homework Assignments
            homeworkRepository.save(new Homework(teacherObj.getId(), "Thermodynamics Lab Report", "Draft lab readings and complete assignment questions 1-5 from Chapter 6.", "Grade 10 - A", "2026-07-22"));
            homeworkRepository.save(new Homework(teacherObj.getId(), "Light Waves Equation solving", "Complete worksheets distributed in class yesterday.", "Grade 10 - A", "2026-07-20"));
            homeworkRepository.save(new Homework("T.OTHER", "Algebreic Expressions Exercises", "Solve equations on page 245 of Math Textbook.", "Grade 10 - A", "2026-07-24"));
            homeworkRepository.save(new Homework(teacherObj.getId(), "Forces workbook", "Homework description details.", "Grade 8 - B", "2026-07-25"));

            // 6. Create Notices
            noticeRepository.save(new Notice("Terminal Exam Schedule Published", "Term exams start from August 5. Timetable can be picked from office desk.", "all", "2026-07-19"));
            noticeRepository.save(new Notice("Notice Board: Sports Day Signups", "Register your athletics events interest on physical forms before July 25.", "all", "2026-07-18"));
            noticeRepository.save(new Notice("Class Note: Lab Book Submission", "Bring updated experimental readings report to the lab workspace tomorrow.", "Grade 10 - A", "2026-07-19"));

            // 7. Create Fee collection logs
            feeRepository.save(new Fee(studentObj.getId(), 25000.0, "paid", "2026-06-01"));
            feeRepository.save(new Fee(studentObj.getId(), 25000.0, "pending", "2026-07-01"));
            feeRepository.save(new Fee(sibling1.getId(), 20000.0, "paid", "2026-07-01"));
            feeRepository.save(new Fee(sibling2.getId(), 15000.0, "pending", "2026-07-01"));

            System.out.println("MongoDB database populated successfully with Smart School mock records!");
        } else {
            System.out.println("MongoDB already contains user documents. Skipping seeder run.");
        }
    }
}
