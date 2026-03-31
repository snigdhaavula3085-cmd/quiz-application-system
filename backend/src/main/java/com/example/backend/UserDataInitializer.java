package com.example.backend;

import com.example.backend.model.Question;
import com.example.backend.model.Subject;
import com.example.backend.model.User;
import com.example.backend.repository.QuestionRepository;
import com.example.backend.repository.SubjectRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;

    public UserDataInitializer(UserRepository userRepository, 
                               SubjectRepository subjectRepository, 
                               QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        ensureUser("admin", "admin123", "ADMIN");
        ensureUser("snigdha_30", "pass123", "USER");
        ensureUser("testuser", "testpass123", "USER");

        initializeQuizData();
    }

    private void initializeQuizData() {
        Subject python = ensureSubject("Python", "All about Python programming.");
        Subject java = ensureSubject("Java", "Core Java and advanced concepts.");
        Subject js = ensureSubject("JavaScript", "Modern JS, ES6+, and React ecosystem.");

        ensureQuestions(python, "What is the correct way to create a function in Python?", "func x():", "def x():", "function x():", "create x():", "def x():");
        ensureQuestions(python, "Which of these is NOT a Python data type?", "tuple", "list", "linkedlist", "dict", "linkedlist");
        
        ensureQuestions(java, "Which keyword is used to inherit a class in Java?", "implements", "inherits", "extends", "super", "extends");
        ensureQuestions(java, "What is the root class of all Java classes?", "Object", "Main", "System", "Base", "Object");

        ensureQuestions(js, "Which keyword is used for constants in JS?", "var", "let", "const", "fixed", "const");
        ensureQuestions(js, "What does DOM stand for?", "Document Object Model", "Dynamic Object Model", "Digital Object Mode", "Data Object Model", "Document Object Model");
    }

    private Subject ensureSubject(String name, String description) {
        return subjectRepository.findByName(name).orElseGet(() -> 
            subjectRepository.save(new Subject(name, description))
        );
    }

    private void ensureQuestions(Subject subject, String text, String optA, String optB, String optC, String optD, String answer) {
        if (questionRepository.findBySubject_Id(subject.getId()).isEmpty()) {
            Question q = new Question();
            q.setText(text);
            q.setOptionA(optA);
            q.setOptionB(optB);
            q.setOptionC(optC);
            q.setOptionD(optD);
            q.setCorrectAnswer(answer);
            q.setSubject(subject);
            questionRepository.save(q);
        }
    }

    private void ensureUser(String username, String password, String role) {
        userRepository.findByUsername(username).ifPresentOrElse(
            user -> {
                user.setPassword(password); // Update password to known one for consistency
                user.setRole(role);
                userRepository.save(user);
            },
            () -> {
                userRepository.save(new User(username, password, role));
            }
        );
    }
}
