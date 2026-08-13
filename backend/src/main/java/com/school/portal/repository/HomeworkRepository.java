package com.school.portal.repository;

import com.school.portal.models.Homework;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HomeworkRepository extends MongoRepository<Homework, String> {
    List<Homework> findByClassId(String classId);
    List<Homework> findByTeacherId(String teacherId);
}
