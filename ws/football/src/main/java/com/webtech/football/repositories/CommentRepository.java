package com.webtech.football.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.webtech.football.entities.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

}