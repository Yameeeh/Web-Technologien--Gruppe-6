package com.webtech.football.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webtech.football.entities.NewsletterAdresse;

@Repository
public interface NewsletterRepository extends JpaRepository<NewsletterAdresse, Long> {

	NewsletterAdresse getByAdresse(String email);

	void deleteByAdresse(String email);

}
