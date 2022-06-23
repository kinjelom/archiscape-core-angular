import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProjectElement, ProjectElement } from '../project-element.model';
import { ProjectElementService } from '../service/project-element.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ElementType } from 'app/entities/enumerations/element-type.model';

@Component({
  selector: 'jhi-project-element-update',
  templateUrl: './project-element-update.component.html',
})
export class ProjectElementUpdateComponent implements OnInit {
  isSaving = false;
  elementTypeValues = Object.keys(ElementType);

  projectsSharedCollection: IProject[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    type: [null, [Validators.required]],
    documentation: [],
    landscapeElementId: [null, [Validators.maxLength(30)]],
    project: [null, Validators.required],
  });

  constructor(
    protected projectElementService: ProjectElementService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectElement }) => {
      this.updateForm(projectElement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectElement = this.createFromForm();
    if (projectElement.id !== undefined) {
      this.subscribeToSaveResponse(this.projectElementService.update(projectElement));
    } else {
      this.subscribeToSaveResponse(this.projectElementService.create(projectElement));
    }
  }

  trackProjectById(_index: number, item: IProject): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectElement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(projectElement: IProjectElement): void {
    this.editForm.patchValue({
      id: projectElement.id,
      name: projectElement.name,
      type: projectElement.type,
      documentation: projectElement.documentation,
      landscapeElementId: projectElement.landscapeElementId,
      project: projectElement.project,
    });

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing(
      this.projectsSharedCollection,
      projectElement.project
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing(projects, this.editForm.get('project')!.value))
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }

  protected createFromForm(): IProjectElement {
    return {
      ...new ProjectElement(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      type: this.editForm.get(['type'])!.value,
      documentation: this.editForm.get(['documentation'])!.value,
      landscapeElementId: this.editForm.get(['landscapeElementId'])!.value,
      project: this.editForm.get(['project'])!.value,
    };
  }
}
