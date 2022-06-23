import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandscapeElementComponent } from '../list/landscape-element.component';
import { LandscapeElementDetailComponent } from '../detail/landscape-element-detail.component';
import { LandscapeElementUpdateComponent } from '../update/landscape-element-update.component';
import { LandscapeElementRoutingResolveService } from './landscape-element-routing-resolve.service';

const landscapeElementRoute: Routes = [
  {
    path: '',
    component: LandscapeElementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandscapeElementDetailComponent,
    resolve: {
      landscapeElement: LandscapeElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandscapeElementUpdateComponent,
    resolve: {
      landscapeElement: LandscapeElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandscapeElementUpdateComponent,
    resolve: {
      landscapeElement: LandscapeElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landscapeElementRoute)],
  exports: [RouterModule],
})
export class LandscapeElementRoutingModule {}
