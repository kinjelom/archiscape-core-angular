package net.archiscape.app.core.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;
import net.archiscape.app.core.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TextFileContentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TextFileContent.class);
        TextFileContent textFileContent1 = new TextFileContent();
        textFileContent1.setId(UUID.randomUUID());
        TextFileContent textFileContent2 = new TextFileContent();
        textFileContent2.setId(textFileContent1.getId());
        assertThat(textFileContent1).isEqualTo(textFileContent2);
        textFileContent2.setId(UUID.randomUUID());
        assertThat(textFileContent1).isNotEqualTo(textFileContent2);
        textFileContent1.setId(null);
        assertThat(textFileContent1).isNotEqualTo(textFileContent2);
    }
}
