package com.school.portal.dto;

public class UserRegistrationDto {
    private String name;
    private String email;
    private String password;
    private String role; // "student", "teacher", "admin"
    
    // Student specifics
    private String studentCode;
    private String parentName;
    private String dob;
    private String bloodGroup;
    private String phone;
    
    // Teacher specifics
    private String teacherCode;
    private String subject;
    
    // Common student/teacher
    private String classId; // "Grade 10 - A", etc.

    public UserRegistrationDto() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getTeacherCode() { return teacherCode; }
    public void setTeacherCode(String teacherCode) { this.teacherCode = teacherCode; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }
}
