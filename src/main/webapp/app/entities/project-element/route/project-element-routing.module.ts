import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectElementComponent } from '../list/project-element.component';
import { ProjectElementDetailComponent } from '../detail/project-element-detail.component';
import { ProjectElementUpdateComponent } from '../update/project-element-update.component';
import { ProjectElementRoutingResolveService } from './project-element-routing-resolve.service';

const projectElementRoute: Routes = [
  {
    path: '',
    component: ProjectElementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectElementDetailComponent,
    resolve: {
      projectElement: ProjectElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectElementUpdateComponent,
    resolve: {
      projectElement: ProjectElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectElementUpdateComponent,
    resolve: {
      projectElement: ProjectElementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectElementRoute)],
  exports: [RouterModule],
})
export class ProjectElementRoutingModule {}
