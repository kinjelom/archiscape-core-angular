import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILandscape, Landscape } from '../landscape.model';
import { LandscapeService } from '../service/landscape.service';

@Injectable({ providedIn: 'root' })
export class LandscapeRoutingResolveService implements Resolve<ILandscape> {
  constructor(protected service: LandscapeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILandscape> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((landscape: HttpResponse<Landscape>) => {
          if (landscape.body) {
            return of(landscape.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Landscape());
  }
}
