package net.archiscape.app.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.archiscape.app.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LandscapeElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LandscapeElement.class);
        LandscapeElement landscapeElement1 = new LandscapeElement();
        landscapeElement1.setId("id1");
        LandscapeElement landscapeElement2 = new LandscapeElement();
        landscapeElement2.setId(landscapeElement1.getId());
        assertThat(landscapeElement1).isEqualTo(landscapeElement2);
        landscapeElement2.setId("id2");
        assertThat(landscapeElement1).isNotEqualTo(landscapeElement2);
        landscapeElement1.setId(null);
        assertThat(landscapeElement1).isNotEqualTo(landscapeElement2);
    }
}
