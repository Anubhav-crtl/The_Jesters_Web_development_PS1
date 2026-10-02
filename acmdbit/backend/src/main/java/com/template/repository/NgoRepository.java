package com.template.repository;

import com.template.model.Ngo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NgoRepository extends JpaRepository<Ngo, Long> {

    Optional<Ngo> findByEmail(String email);

    List<Ngo> findByStatus(String status);

    List<Ngo> findByStatusOrderByTrustScoreDesc(String status);

    List<Ngo> findByCategoryAndStatus(String category, String status);

    List<Ngo> findByLocationAndStatus(String location, String status);
}