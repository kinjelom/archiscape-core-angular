import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandscapeComponent } from './list/landscape.component';
import { LandscapeDetailComponent } from './detail/landscape-detail.component';
import { LandscapeUpdateComponent } from './update/landscape-update.component';
import { LandscapeDeleteDialogComponent } from './delete/landscape-delete-dialog.component';
import { LandscapeRoutingModule } from './route/landscape-routing.module';

@NgModule({
  imports: [SharedModule, LandscapeRoutingModule],
  declarations: [LandscapeComponent, LandscapeDetailComponent, LandscapeUpdateComponent, LandscapeDeleteDialogComponent],
  entryComponents: [LandscapeDeleteDialogComponent],
})
export class LandscapeModule {}
