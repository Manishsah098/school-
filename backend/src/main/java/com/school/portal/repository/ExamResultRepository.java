package com.school.portal.repository;

import com.school.portal.models.ExamResult;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExamResultRepository extends MongoRepository<ExamResult, String> {
    List<ExamResult> findByStudentId(String studentId);
    List<ExamResult> findByClassId(String classId);
}
