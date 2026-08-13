package com.school.portal.repository;

import com.school.portal.models.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByStudentId(String studentId);
    List<LeaveRequest> findByClassId(String classId);
    List<LeaveRequest> findByStatus(String status);
}
