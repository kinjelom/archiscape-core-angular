import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandscapeElement } from '../landscape-element.model';
import { LandscapeElementService } from '../service/landscape-element.service';

@Component({
  templateUrl: './landscape-element-delete-dialog.component.html',
})
export class LandscapeElementDeleteDialogComponent {
  landscapeElement?: ILandscapeElement;

  constructor(protected landscapeElementService: LandscapeElementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.landscapeElementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
