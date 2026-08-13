package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teachers")
public class Teacher {
    @Id
    private String id;
    private String name;
    private String teacherCode;
    private String subject;
    private String userId; // User ref id
    private String classId; // Assigned class

    public Teacher() {}

    public Teacher(String name, String teacherCode, String subject, String userId, String classId) {
        this.name = name;
        this.teacherCode = teacherCode;
        this.subject = subject;
        this.userId = userId;
        this.classId = classId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTeacherCode() { return teacherCode; }
    public void setTeacherCode(String teacherCode) { this.teacherCode = teacherCode; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }
}
