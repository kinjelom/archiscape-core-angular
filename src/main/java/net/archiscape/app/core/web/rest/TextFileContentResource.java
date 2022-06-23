package net.archiscape.app.core.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import net.archiscape.app.core.domain.TextFileContent;
import net.archiscape.app.core.repository.TextFileContentRepository;
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
 * REST controller for managing {@link net.archiscape.app.core.domain.TextFileContent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TextFileContentResource {

    private final Logger log = LoggerFactory.getLogger(TextFileContentResource.class);

    private static final String ENTITY_NAME = "textFileContent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TextFileContentRepository textFileContentRepository;

    public TextFileContentResource(TextFileContentRepository textFileContentRepository) {
        this.textFileContentRepository = textFileContentRepository;
    }

    /**
     * {@code POST  /text-file-contents} : Create a new textFileContent.
     *
     * @param textFileContent the textFileContent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new textFileContent, or with status {@code 400 (Bad Request)} if the textFileContent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/text-file-contents")
    public ResponseEntity<TextFileContent> createTextFileContent(@Valid @RequestBody TextFileContent textFileContent)
        throws URISyntaxException {
        log.debug("REST request to save TextFileContent : {}", textFileContent);
        if (textFileContent.getId() != null) {
            throw new BadRequestAlertException("A new textFileContent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TextFileContent result = textFileContentRepository.save(textFileContent);
        return ResponseEntity
            .created(new URI("/api/text-file-contents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /text-file-contents/:id} : Updates an existing textFileContent.
     *
     * @param id the id of the textFileContent to save.
     * @param textFileContent the textFileContent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated textFileContent,
     * or with status {@code 400 (Bad Request)} if the textFileContent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the textFileContent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/text-file-contents/{id}")
    public ResponseEntity<TextFileContent> updateTextFileContent(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody TextFileContent textFileContent
    ) throws URISyntaxException {
        log.debug("REST request to update TextFileContent : {}, {}", id, textFileContent);
        if (textFileContent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, textFileContent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!textFileContentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TextFileContent result = textFileContentRepository.save(textFileContent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, textFileContent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /text-file-contents/:id} : Partial updates given fields of an existing textFileContent, field will ignore if it is null
     *
     * @param id the id of the textFileContent to save.
     * @param textFileContent the textFileContent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated textFileContent,
     * or with status {@code 400 (Bad Request)} if the textFileContent is not valid,
     * or with status {@code 404 (Not Found)} if the textFileContent is not found,
     * or with status {@code 500 (Internal Server Error)} if the textFileContent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/text-file-contents/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TextFileContent> partialUpdateTextFileContent(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody TextFileContent textFileContent
    ) throws URISyntaxException {
        log.debug("REST request to partial update TextFileContent partially : {}, {}", id, textFileContent);
        if (textFileContent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, textFileContent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!textFileContentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TextFileContent> result = textFileContentRepository
            .findById(textFileContent.getId())
            .map(existingTextFileContent -> {
                if (textFileContent.getVersion() != null) {
                    existingTextFileContent.setVersion(textFileContent.getVersion());
                }
                if (textFileContent.getInsertDate() != null) {
                    existingTextFileContent.setInsertDate(textFileContent.getInsertDate());
                }
                if (textFileContent.getFileName() != null) {
                    existingTextFileContent.setFileName(textFileContent.getFileName());
                }
                if (textFileContent.getContent() != null) {
                    existingTextFileContent.setContent(textFileContent.getContent());
                }

                return existingTextFileContent;
            })
            .map(textFileContentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, textFileContent.getId().toString())
        );
    }

    /**
     * {@code GET  /text-file-contents} : get all the textFileContents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of textFileContents in body.
     */
    @GetMapping("/text-file-contents")
    public ResponseEntity<List<TextFileContent>> getAllTextFileContents(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of TextFileContents");
        Page<TextFileContent> page = textFileContentRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /text-file-contents/:id} : get the "id" textFileContent.
     *
     * @param id the id of the textFileContent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the textFileContent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/text-file-contents/{id}")
    public ResponseEntity<TextFileContent> getTextFileContent(@PathVariable UUID id) {
        log.debug("REST request to get TextFileContent : {}", id);
        Optional<TextFileContent> textFileContent = textFileContentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(textFileContent);
    }

    /**
     * {@code DELETE  /text-file-contents/:id} : delete the "id" textFileContent.
     *
     * @param id the id of the textFileContent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/text-file-contents/{id}")
    public ResponseEntity<Void> deleteTextFileContent(@PathVariable UUID id) {
        log.debug("REST request to delete TextFileContent : {}", id);
        textFileContentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
