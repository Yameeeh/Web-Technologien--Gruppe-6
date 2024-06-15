package com.webtech.football.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.webtech.football.entities.NewsletterAdresse;
import com.webtech.football.repositories.NewsletterRepository;

@Service
public class NewsletterService {

	@Autowired
	private NewsletterRepository newsletterRepository;

	private NewsletterAdresse saveAdresse(String email) {

		NewsletterAdresse newsletterAdresse = new NewsletterAdresse();
		newsletterAdresse.setEmail(email);

		return newsletterRepository.save(newsletterAdresse);
	}

	private void deleteAdresse(String email) {

		newsletterRepository.deleteByAdresse(email);

	}

}
