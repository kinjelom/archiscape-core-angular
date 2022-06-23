import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILandscapeElement, LandscapeElement } from '../landscape-element.model';
import { LandscapeElementService } from '../service/landscape-element.service';
import { ILandscape } from 'app/entities/landscape/landscape.model';
import { LandscapeService } from 'app/entities/landscape/service/landscape.service';
import { ElementType } from 'app/entities/enumerations/element-type.model';

@Component({
  selector: 'jhi-landscape-element-update',
  templateUrl: './landscape-element-update.component.html',
})
export class LandscapeElementUpdateComponent implements OnInit {
  isSaving = false;
  elementTypeValues = Object.keys(ElementType);

  landscapesSharedCollection: ILandscape[] = [];

  editForm = this.fb.group({
    id: [null, [Validators.required, Validators.maxLength(30)]],
    type: [null, [Validators.required]],
    documentation: [],
    landscape: [null, Validators.required],
  });

  constructor(
    protected landscapeElementService: LandscapeElementService,
    protected landscapeService: LandscapeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landscapeElement }) => {
      this.updateForm(landscapeElement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const landscapeElement = this.createFromForm();
    if (landscapeElement.id !== undefined) {
      this.subscribeToSaveResponse(this.landscapeElementService.update(landscapeElement));
    } else {
      this.subscribeToSaveResponse(this.landscapeElementService.create(landscapeElement));
    }
  }

  trackLandscapeById(_index: number, item: ILandscape): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandscapeElement>>): void {
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

  protected updateForm(landscapeElement: ILandscapeElement): void {
    this.editForm.patchValue({
      id: landscapeElement.id,
      type: landscapeElement.type,
      documentation: landscapeElement.documentation,
      landscape: landscapeElement.landscape,
    });

    this.landscapesSharedCollection = this.landscapeService.addLandscapeToCollectionIfMissing(
      this.landscapesSharedCollection,
      landscapeElement.landscape
    );
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
  }

  protected createFromForm(): ILandscapeElement {
    return {
      ...new LandscapeElement(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      documentation: this.editForm.get(['documentation'])!.value,
      landscape: this.editForm.get(['landscape'])!.value,
    };
  }
}
