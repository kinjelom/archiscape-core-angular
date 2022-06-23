package net.archiscape.app.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import net.archiscape.app.core.IntegrationTest;
import net.archiscape.app.core.domain.TextFileContent;
import net.archiscape.app.core.repository.TextFileContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link TextFileContentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TextFileContentResourceIT {

    private static final Integer DEFAULT_VERSION = 1;
    private static final Integer UPDATED_VERSION = 2;

    private static final LocalDate DEFAULT_INSERT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_INSERT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FILE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/text-file-contents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TextFileContentRepository textFileContentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTextFileContentMockMvc;

    private TextFileContent textFileContent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TextFileContent createEntity(EntityManager em) {
        TextFileContent textFileContent = new TextFileContent()
            .version(DEFAULT_VERSION)
            .insertDate(DEFAULT_INSERT_DATE)
            .fileName(DEFAULT_FILE_NAME)
            .content(DEFAULT_CONTENT);
        return textFileContent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TextFileContent createUpdatedEntity(EntityManager em) {
        TextFileContent textFileContent = new TextFileContent()
            .version(UPDATED_VERSION)
            .insertDate(UPDATED_INSERT_DATE)
            .fileName(UPDATED_FILE_NAME)
            .content(UPDATED_CONTENT);
        return textFileContent;
    }

    @BeforeEach
    public void initTest() {
        textFileContent = createEntity(em);
    }

    @Test
    @Transactional
    void createTextFileContent() throws Exception {
        int databaseSizeBeforeCreate = textFileContentRepository.findAll().size();
        // Create the TextFileContent
        restTextFileContentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isCreated());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeCreate + 1);
        TextFileContent testTextFileContent = textFileContentList.get(textFileContentList.size() - 1);
        assertThat(testTextFileContent.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testTextFileContent.getInsertDate()).isEqualTo(DEFAULT_INSERT_DATE);
        assertThat(testTextFileContent.getFileName()).isEqualTo(DEFAULT_FILE_NAME);
        assertThat(testTextFileContent.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void createTextFileContentWithExistingId() throws Exception {
        // Create the TextFileContent with an existing ID
        textFileContentRepository.saveAndFlush(textFileContent);

        int databaseSizeBeforeCreate = textFileContentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTextFileContentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkVersionIsRequired() throws Exception {
        int databaseSizeBeforeTest = textFileContentRepository.findAll().size();
        // set the field null
        textFileContent.setVersion(null);

        // Create the TextFileContent, which fails.

        restTextFileContentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInsertDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = textFileContentRepository.findAll().size();
        // set the field null
        textFileContent.setInsertDate(null);

        // Create the TextFileContent, which fails.

        restTextFileContentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTextFileContents() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        // Get all the textFileContentList
        restTextFileContentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(textFileContent.getId().toString())))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].insertDate").value(hasItem(DEFAULT_INSERT_DATE.toString())))
            .andExpect(jsonPath("$.[*].fileName").value(hasItem(DEFAULT_FILE_NAME)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    @Transactional
    void getTextFileContent() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        // Get the textFileContent
        restTextFileContentMockMvc
            .perform(get(ENTITY_API_URL_ID, textFileContent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(textFileContent.getId().toString()))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION))
            .andExpect(jsonPath("$.insertDate").value(DEFAULT_INSERT_DATE.toString()))
            .andExpect(jsonPath("$.fileName").value(DEFAULT_FILE_NAME))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingTextFileContent() throws Exception {
        // Get the textFileContent
        restTextFileContentMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTextFileContent() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();

        // Update the textFileContent
        TextFileContent updatedTextFileContent = textFileContentRepository.findById(textFileContent.getId()).get();
        // Disconnect from session so that the updates on updatedTextFileContent are not directly saved in db
        em.detach(updatedTextFileContent);
        updatedTextFileContent
            .version(UPDATED_VERSION)
            .insertDate(UPDATED_INSERT_DATE)
            .fileName(UPDATED_FILE_NAME)
            .content(UPDATED_CONTENT);

        restTextFileContentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTextFileContent.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTextFileContent))
            )
            .andExpect(status().isOk());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
        TextFileContent testTextFileContent = textFileContentList.get(textFileContentList.size() - 1);
        assertThat(testTextFileContent.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testTextFileContent.getInsertDate()).isEqualTo(UPDATED_INSERT_DATE);
        assertThat(testTextFileContent.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testTextFileContent.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void putNonExistingTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, textFileContent.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTextFileContentWithPatch() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();

        // Update the textFileContent using partial update
        TextFileContent partialUpdatedTextFileContent = new TextFileContent();
        partialUpdatedTextFileContent.setId(textFileContent.getId());

        partialUpdatedTextFileContent.version(UPDATED_VERSION).fileName(UPDATED_FILE_NAME);

        restTextFileContentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTextFileContent.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTextFileContent))
            )
            .andExpect(status().isOk());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
        TextFileContent testTextFileContent = textFileContentList.get(textFileContentList.size() - 1);
        assertThat(testTextFileContent.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testTextFileContent.getInsertDate()).isEqualTo(DEFAULT_INSERT_DATE);
        assertThat(testTextFileContent.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testTextFileContent.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    @Transactional
    void fullUpdateTextFileContentWithPatch() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();

        // Update the textFileContent using partial update
        TextFileContent partialUpdatedTextFileContent = new TextFileContent();
        partialUpdatedTextFileContent.setId(textFileContent.getId());

        partialUpdatedTextFileContent
            .version(UPDATED_VERSION)
            .insertDate(UPDATED_INSERT_DATE)
            .fileName(UPDATED_FILE_NAME)
            .content(UPDATED_CONTENT);

        restTextFileContentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTextFileContent.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTextFileContent))
            )
            .andExpect(status().isOk());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
        TextFileContent testTextFileContent = textFileContentList.get(textFileContentList.size() - 1);
        assertThat(testTextFileContent.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testTextFileContent.getInsertDate()).isEqualTo(UPDATED_INSERT_DATE);
        assertThat(testTextFileContent.getFileName()).isEqualTo(UPDATED_FILE_NAME);
        assertThat(testTextFileContent.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void patchNonExistingTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, textFileContent.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isBadRequest());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTextFileContent() throws Exception {
        int databaseSizeBeforeUpdate = textFileContentRepository.findAll().size();
        textFileContent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTextFileContentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(textFileContent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TextFileContent in the database
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTextFileContent() throws Exception {
        // Initialize the database
        textFileContentRepository.saveAndFlush(textFileContent);

        int databaseSizeBeforeDelete = textFileContentRepository.findAll().size();

        // Delete the textFileContent
        restTextFileContentMockMvc
            .perform(delete(ENTITY_API_URL_ID, textFileContent.getId().toString()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TextFileContent> textFileContentList = textFileContentRepository.findAll();
        assertThat(textFileContentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
