import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandscape } from '../landscape.model';
import { LandscapeService } from '../service/landscape.service';

@Component({
  templateUrl: './landscape-delete-dialog.component.html',
})
export class LandscapeDeleteDialogComponent {
  landscape?: ILandscape;

  constructor(protected landscapeService: LandscapeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.landscapeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
