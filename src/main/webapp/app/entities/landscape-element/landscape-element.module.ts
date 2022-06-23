import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandscapeElementComponent } from './list/landscape-element.component';
import { LandscapeElementDetailComponent } from './detail/landscape-element-detail.component';
import { LandscapeElementUpdateComponent } from './update/landscape-element-update.component';
import { LandscapeElementDeleteDialogComponent } from './delete/landscape-element-delete-dialog.component';
import { LandscapeElementRoutingModule } from './route/landscape-element-routing.module';

@NgModule({
  imports: [SharedModule, LandscapeElementRoutingModule],
  declarations: [
    LandscapeElementComponent,
    LandscapeElementDetailComponent,
    LandscapeElementUpdateComponent,
    LandscapeElementDeleteDialogComponent,
  ],
  entryComponents: [LandscapeElementDeleteDialogComponent],
})
export class LandscapeElementModule {}
