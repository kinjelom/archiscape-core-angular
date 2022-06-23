import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILandscapeElement, LandscapeElement } from '../landscape-element.model';
import { LandscapeElementService } from '../service/landscape-element.service';

@Injectable({ providedIn: 'root' })
export class LandscapeElementRoutingResolveService implements Resolve<ILandscapeElement> {
  constructor(protected service: LandscapeElementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILandscapeElement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((landscapeElement: HttpResponse<LandscapeElement>) => {
          if (landscapeElement.body) {
            return of(landscapeElement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LandscapeElement());
  }
}
