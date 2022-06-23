import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TextFileContentComponent } from './list/text-file-content.component';
import { TextFileContentDetailComponent } from './detail/text-file-content-detail.component';
import { TextFileContentUpdateComponent } from './update/text-file-content-update.component';
import { TextFileContentDeleteDialogComponent } from './delete/text-file-content-delete-dialog.component';
import { TextFileContentRoutingModule } from './route/text-file-content-routing.module';

@NgModule({
  imports: [SharedModule, TextFileContentRoutingModule],
  declarations: [
    TextFileContentComponent,
    TextFileContentDetailComponent,
    TextFileContentUpdateComponent,
    TextFileContentDeleteDialogComponent,
  ],
  entryComponents: [TextFileContentDeleteDialogComponent],
})
export class TextFileContentModule {}
