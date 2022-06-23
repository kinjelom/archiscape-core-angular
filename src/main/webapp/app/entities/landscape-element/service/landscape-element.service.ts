import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILandscapeElement, getLandscapeElementIdentifier } from '../landscape-element.model';

export type EntityResponseType = HttpResponse<ILandscapeElement>;
export type EntityArrayResponseType = HttpResponse<ILandscapeElement[]>;

@Injectable({ providedIn: 'root' })
export class LandscapeElementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/landscape-elements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(landscapeElement: ILandscapeElement): Observable<EntityResponseType> {
    return this.http.post<ILandscapeElement>(this.resourceUrl, landscapeElement, { observe: 'response' });
  }

  update(landscapeElement: ILandscapeElement): Observable<EntityResponseType> {
    return this.http.put<ILandscapeElement>(
      `${this.resourceUrl}/${getLandscapeElementIdentifier(landscapeElement) as string}`,
      landscapeElement,
      { observe: 'response' }
    );
  }

  partialUpdate(landscapeElement: ILandscapeElement): Observable<EntityResponseType> {
    return this.http.patch<ILandscapeElement>(
      `${this.resourceUrl}/${getLandscapeElementIdentifier(landscapeElement) as string}`,
      landscapeElement,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ILandscapeElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILandscapeElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLandscapeElementToCollectionIfMissing(
    landscapeElementCollection: ILandscapeElement[],
    ...landscapeElementsToCheck: (ILandscapeElement | null | undefined)[]
  ): ILandscapeElement[] {
    const landscapeElements: ILandscapeElement[] = landscapeElementsToCheck.filter(isPresent);
    if (landscapeElements.length > 0) {
      const landscapeElementCollectionIdentifiers = landscapeElementCollection.map(
        landscapeElementItem => getLandscapeElementIdentifier(landscapeElementItem)!
      );
      const landscapeElementsToAdd = landscapeElements.filter(landscapeElementItem => {
        const landscapeElementIdentifier = getLandscapeElementIdentifier(landscapeElementItem);
        if (landscapeElementIdentifier == null || landscapeElementCollectionIdentifiers.includes(landscapeElementIdentifier)) {
          return false;
        }
        landscapeElementCollectionIdentifiers.push(landscapeElementIdentifier);
        return true;
      });
      return [...landscapeElementsToAdd, ...landscapeElementCollection];
    }
    return landscapeElementCollection;
  }
}
