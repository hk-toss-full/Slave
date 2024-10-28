package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "user_email")})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, length = 100)
    private String userEmail;

    @Column(nullable = false, length = 50)
    private String userName;

    @Column(length = 255)
    private String userImage;

    // 추가된 생성자
    public User(String userEmail, String userName, String userImage) {
        this.userEmail = userEmail;
        this.userName = userName;
        this.userImage = userImage;
    }
}
