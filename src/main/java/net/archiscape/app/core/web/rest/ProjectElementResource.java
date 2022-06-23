package net.archiscape.app.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.archiscape.app.core.domain.ProjectElement;
import net.archiscape.app.core.repository.ProjectElementRepository;
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
 * REST controller for managing {@link net.archiscape.app.core.domain.ProjectElement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectElementResource {

    private final Logger log = LoggerFactory.getLogger(ProjectElementResource.class);

    private static final String ENTITY_NAME = "projectElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProjectElementRepository projectElementRepository;

    public ProjectElementResource(ProjectElementRepository projectElementRepository) {
        this.projectElementRepository = projectElementRepository;
    }

    /**
     * {@code POST  /project-elements} : Create a new projectElement.
     *
     * @param projectElement the projectElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new projectElement, or with status {@code 400 (Bad Request)} if the projectElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/project-elements")
    public ResponseEntity<ProjectElement> createProjectElement(@Valid @RequestBody ProjectElement projectElement)
        throws URISyntaxException {
        log.debug("REST request to save ProjectElement : {}", projectElement);
        if (projectElement.getId() != null) {
            throw new BadRequestAlertException("A new projectElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProjectElement result = projectElementRepository.save(projectElement);
        return ResponseEntity
            .created(new URI("/api/project-elements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /project-elements/:id} : Updates an existing projectElement.
     *
     * @param id the id of the projectElement to save.
     * @param projectElement the projectElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectElement,
     * or with status {@code 400 (Bad Request)} if the projectElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the projectElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/project-elements/{id}")
    public ResponseEntity<ProjectElement> updateProjectElement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProjectElement projectElement
    ) throws URISyntaxException {
        log.debug("REST request to update ProjectElement : {}, {}", id, projectElement);
        if (projectElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProjectElement result = projectElementRepository.save(projectElement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectElement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /project-elements/:id} : Partial updates given fields of an existing projectElement, field will ignore if it is null
     *
     * @param id the id of the projectElement to save.
     * @param projectElement the projectElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated projectElement,
     * or with status {@code 400 (Bad Request)} if the projectElement is not valid,
     * or with status {@code 404 (Not Found)} if the projectElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the projectElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/project-elements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProjectElement> partialUpdateProjectElement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProjectElement projectElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProjectElement partially : {}, {}", id, projectElement);
        if (projectElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, projectElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!projectElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProjectElement> result = projectElementRepository
            .findById(projectElement.getId())
            .map(existingProjectElement -> {
                if (projectElement.getName() != null) {
                    existingProjectElement.setName(projectElement.getName());
                }
                if (projectElement.getType() != null) {
                    existingProjectElement.setType(projectElement.getType());
                }
                if (projectElement.getDocumentation() != null) {
                    existingProjectElement.setDocumentation(projectElement.getDocumentation());
                }
                if (projectElement.getLandscapeElementId() != null) {
                    existingProjectElement.setLandscapeElementId(projectElement.getLandscapeElementId());
                }

                return existingProjectElement;
            })
            .map(projectElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, projectElement.getId().toString())
        );
    }

    /**
     * {@code GET  /project-elements} : get all the projectElements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of projectElements in body.
     */
    @GetMapping("/project-elements")
    public ResponseEntity<List<ProjectElement>> getAllProjectElements(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ProjectElements");
        Page<ProjectElement> page = projectElementRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /project-elements/:id} : get the "id" projectElement.
     *
     * @param id the id of the projectElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the projectElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/project-elements/{id}")
    public ResponseEntity<ProjectElement> getProjectElement(@PathVariable Long id) {
        log.debug("REST request to get ProjectElement : {}", id);
        Optional<ProjectElement> projectElement = projectElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(projectElement);
    }

    /**
     * {@code DELETE  /project-elements/:id} : delete the "id" projectElement.
     *
     * @param id the id of the projectElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/project-elements/{id}")
    public ResponseEntity<Void> deleteProjectElement(@PathVariable Long id) {
        log.debug("REST request to delete ProjectElement : {}", id);
        projectElementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
