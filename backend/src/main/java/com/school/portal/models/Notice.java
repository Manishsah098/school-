package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notices")
public class Notice {
    @Id
    private String id;
    private String title;
    private String message;
    private String classId; // "all" or specific class
    private String createdAt; // "YYYY-MM-DD"

    public Notice() {}

    public Notice(String title, String message, String classId, String createdAt) {
        this.title = title;
        this.message = message;
        this.classId = classId;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
