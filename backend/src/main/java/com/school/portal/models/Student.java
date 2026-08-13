package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
public class Student {
    @Id
    private String id;
    private String name;
    private String studentCode;
    private String parentName;
    private String userId; // User ref id
    private String classId; // "Grade 10 - A"
    private String rollNumber;
    private String dob; // "YYYY-MM-DD"
    private String bloodGroup;
    private String phone;

    public Student() {}

    public Student(String name, String studentCode, String parentName, String userId, String classId, String dob, String bloodGroup, String phone) {
        this.name = name;
        this.studentCode = studentCode;
        this.parentName = parentName;
        this.userId = userId;
        this.classId = classId;
        this.rollNumber = "101";
        this.dob = dob;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getRollNumber() { return rollNumber != null ? rollNumber : "101"; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
