import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectElementComponent } from './list/project-element.component';
import { ProjectElementDetailComponent } from './detail/project-element-detail.component';
import { ProjectElementUpdateComponent } from './update/project-element-update.component';
import { ProjectElementDeleteDialogComponent } from './delete/project-element-delete-dialog.component';
import { ProjectElementRoutingModule } from './route/project-element-routing.module';

@NgModule({
  imports: [SharedModule, ProjectElementRoutingModule],
  declarations: [
    ProjectElementComponent,
    ProjectElementDetailComponent,
    ProjectElementUpdateComponent,
    ProjectElementDeleteDialogComponent,
  ],
  entryComponents: [ProjectElementDeleteDialogComponent],
})
export class ProjectElementModule {}
