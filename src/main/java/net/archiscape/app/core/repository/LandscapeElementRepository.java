package net.archiscape.app.core.repository;

import net.archiscape.app.core.domain.LandscapeElement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LandscapeElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LandscapeElementRepository extends JpaRepository<LandscapeElement, String> {}
