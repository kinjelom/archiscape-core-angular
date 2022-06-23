import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'team',
        data: { pageTitle: 'archiscapeCoreApp.team.home.title' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'landscape',
        data: { pageTitle: 'archiscapeCoreApp.landscape.home.title' },
        loadChildren: () => import('./landscape/landscape.module').then(m => m.LandscapeModule),
      },
      {
        path: 'landscape-element',
        data: { pageTitle: 'archiscapeCoreApp.landscapeElement.home.title' },
        loadChildren: () => import('./landscape-element/landscape-element.module').then(m => m.LandscapeElementModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'archiscapeCoreApp.project.home.title' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'project-element',
        data: { pageTitle: 'archiscapeCoreApp.projectElement.home.title' },
        loadChildren: () => import('./project-element/project-element.module').then(m => m.ProjectElementModule),
      },
      {
        path: 'text-file-content',
        data: { pageTitle: 'archiscapeCoreApp.textFileContent.home.title' },
        loadChildren: () => import('./text-file-content/text-file-content.module').then(m => m.TextFileContentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
