package net.archiscape.app.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.archiscape.app.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProjectElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProjectElement.class);
        ProjectElement projectElement1 = new ProjectElement();
        projectElement1.setId(1L);
        ProjectElement projectElement2 = new ProjectElement();
        projectElement2.setId(projectElement1.getId());
        assertThat(projectElement1).isEqualTo(projectElement2);
        projectElement2.setId(2L);
        assertThat(projectElement1).isNotEqualTo(projectElement2);
        projectElement1.setId(null);
        assertThat(projectElement1).isNotEqualTo(projectElement2);
    }
}
