import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProject, Project } from '../project.model';
import { ProjectService } from '../service/project.service';
import { ILandscape } from 'app/entities/landscape/landscape.model';
import { LandscapeService } from 'app/entities/landscape/service/landscape.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;

  landscapesSharedCollection: ILandscape[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(50)]],
    description: [],
    configuration: [null, [Validators.maxLength(4096)]],
    active: [null, [Validators.required]],
    contentStoreUrl: [null, [Validators.maxLength(2048)]],
    landscape: [null, Validators.required],
    team: [null, Validators.required],
  });

  constructor(
    protected projectService: ProjectService,
    protected landscapeService: LandscapeService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.updateForm(project);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.createFromForm();
    if (project.id !== undefined) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  trackLandscapeById(_index: number, item: ILandscape): string {
    return item.id!;
  }

  trackTeamById(_index: number, item: ITeam): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  protected updateForm(project: IProject): void {
    this.editForm.patchValue({
      id: project.id,
      name: project.name,
      description: project.description,
      configuration: project.configuration,
      active: project.active,
      contentStoreUrl: project.contentStoreUrl,
      landscape: project.landscape,
      team: project.team,
    });

    this.landscapesSharedCollection = this.landscapeService.addLandscapeToCollectionIfMissing(
      this.landscapesSharedCollection,
      project.landscape
    );
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing(this.teamsSharedCollection, project.team);
  }

  protected loadRelationshipsOptions(): void {
    this.landscapeService
      .query()
      .pipe(map((res: HttpResponse<ILandscape[]>) => res.body ?? []))
      .pipe(
        map((landscapes: ILandscape[]) =>
          this.landscapeService.addLandscapeToCollectionIfMissing(landscapes, this.editForm.get('landscape')!.value)
        )
      )
      .subscribe((landscapes: ILandscape[]) => (this.landscapesSharedCollection = landscapes));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing(teams, this.editForm.get('team')!.value)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): IProject {
    return {
      ...new Project(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      configuration: this.editForm.get(['configuration'])!.value,
      active: this.editForm.get(['active'])!.value,
      contentStoreUrl: this.editForm.get(['contentStoreUrl'])!.value,
      landscape: this.editForm.get(['landscape'])!.value,
      team: this.editForm.get(['team'])!.value,
    };
  }
}
