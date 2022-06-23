package net.archiscape.app.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.archiscape.app.core.domain.LandscapeElement;
import net.archiscape.app.core.repository.LandscapeElementRepository;
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
 * REST controller for managing {@link net.archiscape.app.core.domain.LandscapeElement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LandscapeElementResource {

    private final Logger log = LoggerFactory.getLogger(LandscapeElementResource.class);

    private static final String ENTITY_NAME = "landscapeElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LandscapeElementRepository landscapeElementRepository;

    public LandscapeElementResource(LandscapeElementRepository landscapeElementRepository) {
        this.landscapeElementRepository = landscapeElementRepository;
    }

    /**
     * {@code POST  /landscape-elements} : Create a new landscapeElement.
     *
     * @param landscapeElement the landscapeElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new landscapeElement, or with status {@code 400 (Bad Request)} if the landscapeElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/landscape-elements")
    public ResponseEntity<LandscapeElement> createLandscapeElement(@Valid @RequestBody LandscapeElement landscapeElement)
        throws URISyntaxException {
        log.debug("REST request to save LandscapeElement : {}", landscapeElement);
        if (landscapeElement.getId() != null) {
            throw new BadRequestAlertException("A new landscapeElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LandscapeElement result = landscapeElementRepository.save(landscapeElement);
        return ResponseEntity
            .created(new URI("/api/landscape-elements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /landscape-elements/:id} : Updates an existing landscapeElement.
     *
     * @param id the id of the landscapeElement to save.
     * @param landscapeElement the landscapeElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landscapeElement,
     * or with status {@code 400 (Bad Request)} if the landscapeElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the landscapeElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/landscape-elements/{id}")
    public ResponseEntity<LandscapeElement> updateLandscapeElement(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody LandscapeElement landscapeElement
    ) throws URISyntaxException {
        log.debug("REST request to update LandscapeElement : {}, {}", id, landscapeElement);
        if (landscapeElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landscapeElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landscapeElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        landscapeElement.setIsPersisted();
        LandscapeElement result = landscapeElementRepository.save(landscapeElement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, landscapeElement.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /landscape-elements/:id} : Partial updates given fields of an existing landscapeElement, field will ignore if it is null
     *
     * @param id the id of the landscapeElement to save.
     * @param landscapeElement the landscapeElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated landscapeElement,
     * or with status {@code 400 (Bad Request)} if the landscapeElement is not valid,
     * or with status {@code 404 (Not Found)} if the landscapeElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the landscapeElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/landscape-elements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LandscapeElement> partialUpdateLandscapeElement(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody LandscapeElement landscapeElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update LandscapeElement partially : {}, {}", id, landscapeElement);
        if (landscapeElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, landscapeElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!landscapeElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LandscapeElement> result = landscapeElementRepository
            .findById(landscapeElement.getId())
            .map(existingLandscapeElement -> {
                if (landscapeElement.getType() != null) {
                    existingLandscapeElement.setType(landscapeElement.getType());
                }
                if (landscapeElement.getDocumentation() != null) {
                    existingLandscapeElement.setDocumentation(landscapeElement.getDocumentation());
                }

                return existingLandscapeElement;
            })
            .map(landscapeElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, landscapeElement.getId())
        );
    }

    /**
     * {@code GET  /landscape-elements} : get all the landscapeElements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of landscapeElements in body.
     */
    @GetMapping("/landscape-elements")
    public ResponseEntity<List<LandscapeElement>> getAllLandscapeElements(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of LandscapeElements");
        Page<LandscapeElement> page = landscapeElementRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /landscape-elements/:id} : get the "id" landscapeElement.
     *
     * @param id the id of the landscapeElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the landscapeElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/landscape-elements/{id}")
    public ResponseEntity<LandscapeElement> getLandscapeElement(@PathVariable String id) {
        log.debug("REST request to get LandscapeElement : {}", id);
        Optional<LandscapeElement> landscapeElement = landscapeElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(landscapeElement);
    }

    /**
     * {@code DELETE  /landscape-elements/:id} : delete the "id" landscapeElement.
     *
     * @param id the id of the landscapeElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/landscape-elements/{id}")
    public ResponseEntity<Void> deleteLandscapeElement(@PathVariable String id) {
        log.debug("REST request to delete LandscapeElement : {}", id);
        landscapeElementRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
