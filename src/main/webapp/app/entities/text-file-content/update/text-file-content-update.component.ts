import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITextFileContent, TextFileContent } from '../text-file-content.model';
import { TextFileContentService } from '../service/text-file-content.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-text-file-content-update',
  templateUrl: './text-file-content-update.component.html',
})
export class TextFileContentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [null, [Validators.required]],
    version: [null, [Validators.required]],
    insertDate: [null, [Validators.required]],
    fileName: [],
    content: [null, [Validators.required]],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected textFileContentService: TextFileContentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ textFileContent }) => {
      this.updateForm(textFileContent);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('archiscapeCoreApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const textFileContent = this.createFromForm();
    if (textFileContent.id !== undefined) {
      this.subscribeToSaveResponse(this.textFileContentService.update(textFileContent));
    } else {
      this.subscribeToSaveResponse(this.textFileContentService.create(textFileContent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITextFileContent>>): void {
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

  protected updateForm(textFileContent: ITextFileContent): void {
    this.editForm.patchValue({
      id: textFileContent.id,
      version: textFileContent.version,
      insertDate: textFileContent.insertDate,
      fileName: textFileContent.fileName,
      content: textFileContent.content,
    });
  }

  protected createFromForm(): ITextFileContent {
    return {
      ...new TextFileContent(),
      id: this.editForm.get(['id'])!.value,
      version: this.editForm.get(['version'])!.value,
      insertDate: this.editForm.get(['insertDate'])!.value,
      fileName: this.editForm.get(['fileName'])!.value,
      content: this.editForm.get(['content'])!.value,
    };
  }
}
