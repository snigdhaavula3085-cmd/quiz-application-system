package com.example.backend.controller;

import com.example.backend.dto.QuizSubmissionRequest;
import com.example.backend.model.QuizResult;
import com.example.backend.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class QuizResultController {

    @Autowired
    private QuizResultService quizResultService;

    @PostMapping
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmissionRequest request) {
        return ResponseEntity.ok(quizResultService.submitQuiz(request));
    }

    @GetMapping("/user/{userId}")
    public List<QuizResult> getResultsByUser(@PathVariable Long userId) {
        return quizResultService.getResultsByUser(userId);
    }
}
