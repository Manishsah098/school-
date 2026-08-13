package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "homework")
public class Homework {
    @Id
    private String id;
    private String teacherId;
    private String title;
    private String description;
    private String classId; // target class
    private String date; // assignment/due date "YYYY-MM-DD"

    public Homework() {}

    public Homework(String teacherId, String title, String description, String classId, String date) {
        this.teacherId = teacherId;
        this.title = title;
        this.description = description;
        this.classId = classId;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
