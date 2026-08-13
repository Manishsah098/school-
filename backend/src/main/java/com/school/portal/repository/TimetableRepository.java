package com.school.portal.repository;

import com.school.portal.models.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TimetableRepository extends MongoRepository<Timetable, String> {
    List<Timetable> findByClassId(String classId);
    List<Timetable> findByTeacherName(String teacherName);
}
