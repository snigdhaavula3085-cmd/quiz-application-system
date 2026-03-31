package com.example.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env file and set as system properties so Spring can resolve ${...} placeholders
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMissing()  // Don't crash if .env is absent (e.g. on Render where env vars are set via dashboard)
				.load();

		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		SpringApplication.run(BackendApplication.class, args);
	}

}
