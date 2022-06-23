package net.archiscape.app.core.repository;

import net.archiscape.app.core.domain.ProjectElement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProjectElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectElementRepository extends JpaRepository<ProjectElement, Long> {}
