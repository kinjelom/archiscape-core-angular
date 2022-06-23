import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectElement, ProjectElement } from '../project-element.model';
import { ProjectElementService } from '../service/project-element.service';

@Injectable({ providedIn: 'root' })
export class ProjectElementRoutingResolveService implements Resolve<IProjectElement> {
  constructor(protected service: ProjectElementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProjectElement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((projectElement: HttpResponse<ProjectElement>) => {
          if (projectElement.body) {
            return of(projectElement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProjectElement());
  }
}
