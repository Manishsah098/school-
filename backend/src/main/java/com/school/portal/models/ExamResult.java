package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exam_results")
public class ExamResult {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String classId;
    private String examName;
    private String subject;
    private int marksObtained;
    private int totalMarks;
    private String grade;
    private String date;

    public ExamResult() {}

    public ExamResult(String studentId, String studentName, String classId, String examName, String subject, int marksObtained, int totalMarks, String grade, String date) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.classId = classId;
        this.examName = examName;
        this.subject = subject;
        this.marksObtained = marksObtained;
        this.totalMarks = totalMarks;
        this.grade = grade;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getClassId() { return classId; }
    public void setClassId(String classId) { this.classId = classId; }

    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getMarksObtained() { return marksObtained; }
    public void setMarksObtained(int marksObtained) { this.marksObtained = marksObtained; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
