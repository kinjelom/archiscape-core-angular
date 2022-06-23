import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TextFileContentComponent } from '../list/text-file-content.component';
import { TextFileContentDetailComponent } from '../detail/text-file-content-detail.component';
import { TextFileContentUpdateComponent } from '../update/text-file-content-update.component';
import { TextFileContentRoutingResolveService } from './text-file-content-routing-resolve.service';

const textFileContentRoute: Routes = [
  {
    path: '',
    component: TextFileContentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TextFileContentDetailComponent,
    resolve: {
      textFileContent: TextFileContentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TextFileContentUpdateComponent,
    resolve: {
      textFileContent: TextFileContentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TextFileContentUpdateComponent,
    resolve: {
      textFileContent: TextFileContentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(textFileContentRoute)],
  exports: [RouterModule],
})
export class TextFileContentRoutingModule {}
