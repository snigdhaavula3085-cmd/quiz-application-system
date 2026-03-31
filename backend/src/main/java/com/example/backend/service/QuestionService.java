package com.example.backend.service;

import com.example.backend.model.Question;
import com.example.backend.model.Subject;
import com.example.backend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private SubjectService subjectService;

    public List<Question> getQuestionsBySubject(Long subjectId) {
        return questionRepository.findBySubject_Id(subjectId);
    }

    public Question addQuestion(Long subjectId, Question question) {
        Subject subject = subjectService.getSubjectById(subjectId);
        question.setSubject(subject);
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Question existing = questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
        existing.setText(updatedQuestion.getText());
        existing.setOptionA(updatedQuestion.getOptionA());
        existing.setOptionB(updatedQuestion.getOptionB());
        existing.setOptionC(updatedQuestion.getOptionC());
        existing.setOptionD(updatedQuestion.getOptionD());
        existing.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        return questionRepository.save(existing);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
