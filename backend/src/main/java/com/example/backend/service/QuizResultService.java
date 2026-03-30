package com.example.backend.service;

import com.example.backend.dto.QuizSubmissionRequest;
import com.example.backend.model.QuizResult;
import com.example.backend.model.Subject;
import com.example.backend.model.User;
import com.example.backend.repository.QuizResultRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizResultService {

    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectService subjectService;

    public QuizResult submitQuiz(QuizSubmissionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Subject subject = subjectService.getSubjectById(request.getSubjectId());

        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setSubject(subject);
        result.setTotalQuestions(request.getTotalQuestions());
        result.setCorrectAnswers(request.getCorrectAnswers());
        
        double percentage = 0;
        if (request.getTotalQuestions() > 0) {
            percentage = ((double) request.getCorrectAnswers() / request.getTotalQuestions()) * 100;
        }
        result.setScorePercentage(percentage);

        return quizResultRepository.save(result);
    }

    public List<QuizResult> getResultsByUser(Long userId) {
        return quizResultRepository.findByUserId(userId);
    }
}
