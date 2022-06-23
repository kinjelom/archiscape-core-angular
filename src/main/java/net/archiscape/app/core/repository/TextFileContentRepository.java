package net.archiscape.app.core.repository;

import java.util.UUID;
import net.archiscape.app.core.domain.TextFileContent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TextFileContent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TextFileContentRepository extends JpaRepository<TextFileContent, UUID> {}
