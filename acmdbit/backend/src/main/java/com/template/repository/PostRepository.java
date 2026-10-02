package com.template.repository;

import com.template.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByIsTopNeededDescEventDateAsc();

    List<Post> findByNgoIdOrderByCreatedAtDesc(Long ngoId);

    List<Post> findByCategoryOrderByIsTopNeededDescEventDateAsc(String category);

    List<Post> findByIsTopNeededTrueOrderByEventDateAsc();

    List<Post> findByStatusOrderByEventDateAsc(String status);
}