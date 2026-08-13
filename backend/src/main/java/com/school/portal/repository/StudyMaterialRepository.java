package com.school.portal.repository;

import com.school.portal.models.StudyMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StudyMaterialRepository extends MongoRepository<StudyMaterial, String> {
    List<StudyMaterial> findByClassId(String classId);
    List<StudyMaterial> findByUploadedBy(String uploadedBy);
}
