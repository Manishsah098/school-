package com.school.portal.repository;

import com.school.portal.models.Fee;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeeRepository extends MongoRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
}
