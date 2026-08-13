package com.school.portal.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "fees")
public class Fee {
    @Id
    private String id;
    private String studentId;
    private double amount;
    private String status; // "paid" / "pending"
    private String date; // bill date "YYYY-MM-DD"

    public Fee() {}

    public Fee(String studentId, double amount, String status, String date) {
        this.studentId = studentId;
        this.amount = amount;
        this.status = status;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
