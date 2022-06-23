package net.archiscape.app.core.repository;

import net.archiscape.app.core.domain.Landscape;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Landscape entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LandscapeRepository extends JpaRepository<Landscape, String> {}
