package net.archiscape.app.core.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import net.archiscape.app.core.IntegrationTest;
import net.archiscape.app.core.domain.Landscape;
import net.archiscape.app.core.repository.LandscapeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LandscapeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LandscapeResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CONFIGURATION = "AAAAAAAAAA";
    private static final String UPDATED_CONFIGURATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/landscapes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private LandscapeRepository landscapeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLandscapeMockMvc;

    private Landscape landscape;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Landscape createEntity(EntityManager em) {
        Landscape landscape = new Landscape().description(DEFAULT_DESCRIPTION).configuration(DEFAULT_CONFIGURATION);
        return landscape;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Landscape createUpdatedEntity(EntityManager em) {
        Landscape landscape = new Landscape().description(UPDATED_DESCRIPTION).configuration(UPDATED_CONFIGURATION);
        return landscape;
    }

    @BeforeEach
    public void initTest() {
        landscape = createEntity(em);
    }

    @Test
    @Transactional
    void createLandscape() throws Exception {
        int databaseSizeBeforeCreate = landscapeRepository.findAll().size();
        // Create the Landscape
        restLandscapeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isCreated());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeCreate + 1);
        Landscape testLandscape = landscapeList.get(landscapeList.size() - 1);
        assertThat(testLandscape.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLandscape.getConfiguration()).isEqualTo(DEFAULT_CONFIGURATION);
    }

    @Test
    @Transactional
    void createLandscapeWithExistingId() throws Exception {
        // Create the Landscape with an existing ID
        landscape.setId("existing_id");

        int databaseSizeBeforeCreate = landscapeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLandscapeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLandscapes() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        // Get all the landscapeList
        restLandscapeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(landscape.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].configuration").value(hasItem(DEFAULT_CONFIGURATION)));
    }

    @Test
    @Transactional
    void getLandscape() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        // Get the landscape
        restLandscapeMockMvc
            .perform(get(ENTITY_API_URL_ID, landscape.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(landscape.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.configuration").value(DEFAULT_CONFIGURATION));
    }

    @Test
    @Transactional
    void getNonExistingLandscape() throws Exception {
        // Get the landscape
        restLandscapeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLandscape() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();

        // Update the landscape
        Landscape updatedLandscape = landscapeRepository.findById(landscape.getId()).get();
        // Disconnect from session so that the updates on updatedLandscape are not directly saved in db
        em.detach(updatedLandscape);
        updatedLandscape.description(UPDATED_DESCRIPTION).configuration(UPDATED_CONFIGURATION);

        restLandscapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLandscape.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLandscape))
            )
            .andExpect(status().isOk());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
        Landscape testLandscape = landscapeList.get(landscapeList.size() - 1);
        assertThat(testLandscape.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLandscape.getConfiguration()).isEqualTo(UPDATED_CONFIGURATION);
    }

    @Test
    @Transactional
    void putNonExistingLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, landscape.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLandscapeWithPatch() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();

        // Update the landscape using partial update
        Landscape partialUpdatedLandscape = new Landscape();
        partialUpdatedLandscape.setId(landscape.getId());

        restLandscapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLandscape.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLandscape))
            )
            .andExpect(status().isOk());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
        Landscape testLandscape = landscapeList.get(landscapeList.size() - 1);
        assertThat(testLandscape.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLandscape.getConfiguration()).isEqualTo(DEFAULT_CONFIGURATION);
    }

    @Test
    @Transactional
    void fullUpdateLandscapeWithPatch() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();

        // Update the landscape using partial update
        Landscape partialUpdatedLandscape = new Landscape();
        partialUpdatedLandscape.setId(landscape.getId());

        partialUpdatedLandscape.description(UPDATED_DESCRIPTION).configuration(UPDATED_CONFIGURATION);

        restLandscapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLandscape.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLandscape))
            )
            .andExpect(status().isOk());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
        Landscape testLandscape = landscapeList.get(landscapeList.size() - 1);
        assertThat(testLandscape.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLandscape.getConfiguration()).isEqualTo(UPDATED_CONFIGURATION);
    }

    @Test
    @Transactional
    void patchNonExistingLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, landscape.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isBadRequest());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLandscape() throws Exception {
        int databaseSizeBeforeUpdate = landscapeRepository.findAll().size();
        landscape.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLandscapeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(landscape))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Landscape in the database
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLandscape() throws Exception {
        // Initialize the database
        landscape.setId(UUID.randomUUID().toString());
        landscapeRepository.saveAndFlush(landscape);

        int databaseSizeBeforeDelete = landscapeRepository.findAll().size();

        // Delete the landscape
        restLandscapeMockMvc
            .perform(delete(ENTITY_API_URL_ID, landscape.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Landscape> landscapeList = landscapeRepository.findAll();
        assertThat(landscapeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
