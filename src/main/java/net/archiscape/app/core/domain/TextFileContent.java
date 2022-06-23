package net.archiscape.app.core.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Type;

/**
 * A TextFileContent.
 */
@Entity
@Table(name = "text_file_content")
public class TextFileContent implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Type(type = "uuid-char")
    @Column(name = "id", length = 36, nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "version", nullable = false)
    private Integer version;

    @NotNull
    @Column(name = "insert_date", nullable = false)
    private LocalDate insertDate;

    @Column(name = "file_name")
    private String fileName;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public TextFileContent id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getVersion() {
        return this.version;
    }

    public TextFileContent version(Integer version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public LocalDate getInsertDate() {
        return this.insertDate;
    }

    public TextFileContent insertDate(LocalDate insertDate) {
        this.setInsertDate(insertDate);
        return this;
    }

    public void setInsertDate(LocalDate insertDate) {
        this.insertDate = insertDate;
    }

    public String getFileName() {
        return this.fileName;
    }

    public TextFileContent fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContent() {
        return this.content;
    }

    public TextFileContent content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TextFileContent)) {
            return false;
        }
        return id != null && id.equals(((TextFileContent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TextFileContent{" +
            "id=" + getId() +
            ", version=" + getVersion() +
            ", insertDate='" + getInsertDate() + "'" +
            ", fileName='" + getFileName() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
