package net.archiscape.app.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.archiscape.app.core.domain.Landscape;
import net.archiscape.app.core.repository.LandscapeRepository;
import net.archiscape.app.core.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link net.archiscape.app.core.domain.Landscape}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LandscapeResource {

    private final Logger log = LoggerFactory.getLogger(LandscapeResource.class);

    private static final String ENTITY_NAME = "landscape";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LandscapeRepository landscapeRepository;

    public LandscapeResource(LandscapeRepository landscapeRepository) {
        this.landscapeRepository = landscapeRepository;
    }

    /**
     * {@code POST  /landscapes} : Create a new landscape.
     *
     * @param landscape the landscape to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new landscape, or with status {@code 400 (Bad Request)} if the landscape has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/landscapes")
    public ResponseEntity<Landscape> createLandscape(@Valid @RequestBody Landscape landscape) throws URISyntaxException {
        log.debug("REST request to save Landscape : {}", landscape);
        if (landscape.getId() != null) {
            throw new BadRequestAlertException("A new landscape cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Landscape result = landscapeRepository.save(landscape);
        return ResponseEntity
            .created(new URI("/api/landscapes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /landscapes/:id} : Updates an existing landscape.
     *
     * @param id the id of the landscape to save.
     * @param landscape the landscape to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landscape,
     * or with status {@code 400 (Bad Request)} if the landscape is not valid,
     * or with status {@code 500 (Internal Server Error)} if the landscape couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/landscapes/{id}")
    public ResponseEntity<Landscape> updateLandscape(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Landscape landscape
    ) throws URISyntaxException {
        log.debug("REST request to update Landscape : {}, {}", id, landscape);
        if (landscape.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landscape.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landscapeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        landscape.setIsPersisted();
        Landscape result = landscapeRepository.save(landscape);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, landscape.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /landscapes/:id} : Partial updates given fields of an existing landscape, field will ignore if it is null
     *
     * @param id the id of the landscape to save.
     * @param landscape the landscape to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landscape,
     * or with status {@code 400 (Bad Request)} if the landscape is not valid,
     * or with status {@code 404 (Not Found)} if the landscape is not found,
     * or with status {@code 500 (Internal Server Error)} if the landscape couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/landscapes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Landscape> partialUpdateLandscape(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Landscape landscape
    ) throws URISyntaxException {
        log.debug("REST request to partial update Landscape partially : {}, {}", id, landscape);
        if (landscape.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landscape.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landscapeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Landscape> result = landscapeRepository
            .findById(landscape.getId())
            .map(existingLandscape -> {
                if (landscape.getDescription() != null) {
                    existingLandscape.setDescription(landscape.getDescription());
                }
                if (landscape.getConfiguration() != null) {
                    existingLandscape.setConfiguration(landscape.getConfiguration());
                }

                return existingLandscape;
            })
            .map(landscapeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, landscape.getId())
        );
    }

    /**
     * {@code GET  /landscapes} : get all the landscapes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of landscapes in body.
     */
    @GetMapping("/landscapes")
    public ResponseEntity<List<Landscape>> getAllLandscapes(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Landscapes");
        Page<Landscape> page = landscapeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /landscapes/:id} : get the "id" landscape.
     *
     * @param id the id of the landscape to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the landscape, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/landscapes/{id}")
    public ResponseEntity<Landscape> getLandscape(@PathVariable String id) {
        log.debug("REST request to get Landscape : {}", id);
        Optional<Landscape> landscape = landscapeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(landscape);
    }

    /**
     * {@code DELETE  /landscapes/:id} : delete the "id" landscape.
     *
     * @param id the id of the landscape to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/landscapes/{id}")
    public ResponseEntity<Void> deleteLandscape(@PathVariable String id) {
        log.debug("REST request to delete Landscape : {}", id);
        landscapeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
