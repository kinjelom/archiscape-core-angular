import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILandscape, getLandscapeIdentifier } from '../landscape.model';

export type EntityResponseType = HttpResponse<ILandscape>;
export type EntityArrayResponseType = HttpResponse<ILandscape[]>;

@Injectable({ providedIn: 'root' })
export class LandscapeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/landscapes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(landscape: ILandscape): Observable<EntityResponseType> {
    return this.http.post<ILandscape>(this.resourceUrl, landscape, { observe: 'response' });
  }

  update(landscape: ILandscape): Observable<EntityResponseType> {
    return this.http.put<ILandscape>(`${this.resourceUrl}/${getLandscapeIdentifier(landscape) as string}`, landscape, {
      observe: 'response',
    });
  }

  partialUpdate(landscape: ILandscape): Observable<EntityResponseType> {
    return this.http.patch<ILandscape>(`${this.resourceUrl}/${getLandscapeIdentifier(landscape) as string}`, landscape, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ILandscape>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILandscape[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLandscapeToCollectionIfMissing(
    landscapeCollection: ILandscape[],
    ...landscapesToCheck: (ILandscape | null | undefined)[]
  ): ILandscape[] {
    const landscapes: ILandscape[] = landscapesToCheck.filter(isPresent);
    if (landscapes.length > 0) {
      const landscapeCollectionIdentifiers = landscapeCollection.map(landscapeItem => getLandscapeIdentifier(landscapeItem)!);
      const landscapesToAdd = landscapes.filter(landscapeItem => {
        const landscapeIdentifier = getLandscapeIdentifier(landscapeItem);
        if (landscapeIdentifier == null || landscapeCollectionIdentifiers.includes(landscapeIdentifier)) {
          return false;
        }
        landscapeCollectionIdentifiers.push(landscapeIdentifier);
        return true;
      });
      return [...landscapesToAdd, ...landscapeCollection];
    }
    return landscapeCollection;
  }
}
