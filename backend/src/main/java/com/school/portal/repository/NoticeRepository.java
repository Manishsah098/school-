package com.school.portal.repository;

import com.school.portal.models.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NoticeRepository extends MongoRepository<Notice, String> {
    List<Notice> findByClassIdIn(List<String> classIds);
}
