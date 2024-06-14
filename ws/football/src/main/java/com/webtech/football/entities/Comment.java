package com.webtech.football.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Table(name = "comment")
@Data
@NoArgsConstructor
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	private Long id;

	@JoinColumn(name = "USER_ID", nullable = false)
	private String userID;

	@NonNull
	@Column(name = "TEXT", nullable = false)
	private String text;

	@NonNull
	@Column(name = "TIME", nullable = false)
	private LocalDate time;
}
