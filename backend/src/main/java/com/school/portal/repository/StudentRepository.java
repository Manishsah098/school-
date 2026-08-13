package com.school.portal.repository;

import com.school.portal.models.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUserId(String userId);
    List<Student> findByClassId(String classId);
}
