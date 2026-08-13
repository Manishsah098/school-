package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "study_materials")
public class StudyMaterial {
    @Id
    private String id;
    private String title;
    private String subject;
    private String classId;
    private String description;
    private String fileUrl;
    private String uploadedBy;
    private String createdAt;

    public StudyMaterial() {}

    public StudyMaterial(String title, String subject, String classId, String description, String fileUrl, String uploadedBy, String createdAt) {
        this.title = title;
        this.subject = subject;
        this.classId = classId;
        this.description = description;
        this.fileUrl = fileUrl;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
