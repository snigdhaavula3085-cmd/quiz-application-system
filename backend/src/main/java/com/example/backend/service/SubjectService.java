package com.example.backend.service;

import com.example.backend.model.Subject;
import com.example.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id).orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    public Subject createSubject(Subject subject) {
        if (subjectRepository.findByName(subject.getName()).isPresent()) {
            throw new RuntimeException("Subject already exists");
        }
        return subjectRepository.save(subject);
    }
    
    @Transactional
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}
