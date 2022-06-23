import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITextFileContent, TextFileContent } from '../text-file-content.model';
import { TextFileContentService } from '../service/text-file-content.service';

@Injectable({ providedIn: 'root' })
export class TextFileContentRoutingResolveService implements Resolve<ITextFileContent> {
  constructor(protected service: TextFileContentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITextFileContent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((textFileContent: HttpResponse<TextFileContent>) => {
          if (textFileContent.body) {
            return of(textFileContent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TextFileContent());
  }
}
