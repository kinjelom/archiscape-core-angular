import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILandscape, Landscape } from '../landscape.model';
import { LandscapeService } from '../service/landscape.service';

@Component({
  selector: 'jhi-landscape-update',
  templateUrl: './landscape-update.component.html',
})
export class LandscapeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required, Validators.maxLength(10)]],
    description: [],
    configuration: [null, [Validators.maxLength(4096)]],
  });

  constructor(protected landscapeService: LandscapeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landscape }) => {
      this.updateForm(landscape);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const landscape = this.createFromForm();
    if (landscape.id !== undefined) {
      this.subscribeToSaveResponse(this.landscapeService.update(landscape));
    } else {
      this.subscribeToSaveResponse(this.landscapeService.create(landscape));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILandscape>>): void {
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

  protected updateForm(landscape: ILandscape): void {
    this.editForm.patchValue({
      id: landscape.id,
      description: landscape.description,
      configuration: landscape.configuration,
    });
  }

  protected createFromForm(): ILandscape {
    return {
      ...new Landscape(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      configuration: this.editForm.get(['configuration'])!.value,
    };
  }
}
