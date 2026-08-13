package com.school.portal.repository;

import com.school.portal.models.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByStudentIdAndDate(String studentId, String date);
}
