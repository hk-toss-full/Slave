package com.example.user.repository;

import com.example.user.domain.UserConversationAccess;
import com.example.user.domain.UserConversationAccessId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserConversationAccessRepository extends JpaRepository<UserConversationAccess, UserConversationAccessId> {}
