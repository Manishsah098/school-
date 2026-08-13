package com.school.portal.repository;

import com.school.portal.models.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByUserId(String userId);
}
