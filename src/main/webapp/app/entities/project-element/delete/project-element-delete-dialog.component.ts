import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjectElement } from '../project-element.model';
import { ProjectElementService } from '../service/project-element.service';

@Component({
  templateUrl: './project-element-delete-dialog.component.html',
})
export class ProjectElementDeleteDialogComponent {
  projectElement?: IProjectElement;

  constructor(protected projectElementService: ProjectElementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectElementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
