package net.archiscape.app.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import net.archiscape.app.core.domain.enumeration.ElementType;

/**
 * A ProjectElement.
 */
@Entity
@Table(name = "project_element")
public class ProjectElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ElementType type;

    @Column(name = "documentation")
    private String documentation;

    @Size(max = 30)
    @Column(name = "landscape_element_id", length = 30)
    private String landscapeElementId;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "landscape", "team" }, allowSetters = true)
    private Project project;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProjectElement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ProjectElement name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ElementType getType() {
        return this.type;
    }

    public ProjectElement type(ElementType type) {
        this.setType(type);
        return this;
    }

    public void setType(ElementType type) {
        this.type = type;
    }

    public String getDocumentation() {
        return this.documentation;
    }

    public ProjectElement documentation(String documentation) {
        this.setDocumentation(documentation);
        return this;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public String getLandscapeElementId() {
        return this.landscapeElementId;
    }

    public ProjectElement landscapeElementId(String landscapeElementId) {
        this.setLandscapeElementId(landscapeElementId);
        return this;
    }

    public void setLandscapeElementId(String landscapeElementId) {
        this.landscapeElementId = landscapeElementId;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectElement project(Project project) {
        this.setProject(project);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProjectElement)) {
            return false;
        }
        return id != null && id.equals(((ProjectElement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProjectElement{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", documentation='" + getDocumentation() + "'" +
            ", landscapeElementId='" + getLandscapeElementId() + "'" +
            "}";
    }
}
