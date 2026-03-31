package com.example.backend.controller;

import com.example.backend.model.Question;
import com.example.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/subject/{subjectId}")
    public List<Question> getQuestionsBySubject(@PathVariable Long subjectId) {
        return questionService.getQuestionsBySubject(subjectId);
    }

    // Admin endpoints
    @PostMapping("/subject/{subjectId}")
    public ResponseEntity<Question> addQuestion(@PathVariable Long subjectId, @RequestBody Question question, @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(questionService.addQuestion(subjectId, question));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question, @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id, @RequestHeader(value = "X-Role", required = false) String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
}
