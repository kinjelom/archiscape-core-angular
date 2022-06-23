package net.archiscape.app.core;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import net.archiscape.app.core.ArchiscapeCoreApp;
import net.archiscape.app.core.config.TestSecurityConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { ArchiscapeCoreApp.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
