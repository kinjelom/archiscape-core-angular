package net.archiscape.app.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import net.archiscape.app.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LandscapeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Landscape.class);
        Landscape landscape1 = new Landscape();
        landscape1.setId("id1");
        Landscape landscape2 = new Landscape();
        landscape2.setId(landscape1.getId());
        assertThat(landscape1).isEqualTo(landscape2);
        landscape2.setId("id2");
        assertThat(landscape1).isNotEqualTo(landscape2);
        landscape1.setId(null);
        assertThat(landscape1).isNotEqualTo(landscape2);
    }
}
