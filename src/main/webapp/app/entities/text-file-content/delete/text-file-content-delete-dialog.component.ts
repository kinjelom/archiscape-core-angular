import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITextFileContent } from '../text-file-content.model';
import { TextFileContentService } from '../service/text-file-content.service';

@Component({
  templateUrl: './text-file-content-delete-dialog.component.html',
})
export class TextFileContentDeleteDialogComponent {
  textFileContent?: ITextFileContent;

  constructor(protected textFileContentService: TextFileContentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.textFileContentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
