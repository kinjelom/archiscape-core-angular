import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandscapeComponent } from '../list/landscape.component';
import { LandscapeDetailComponent } from '../detail/landscape-detail.component';
import { LandscapeUpdateComponent } from '../update/landscape-update.component';
import { LandscapeRoutingResolveService } from './landscape-routing-resolve.service';

const landscapeRoute: Routes = [
  {
    path: '',
    component: LandscapeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandscapeDetailComponent,
    resolve: {
      landscape: LandscapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandscapeUpdateComponent,
    resolve: {
      landscape: LandscapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandscapeUpdateComponent,
    resolve: {
      landscape: LandscapeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landscapeRoute)],
  exports: [RouterModule],
})
export class LandscapeRoutingModule {}
