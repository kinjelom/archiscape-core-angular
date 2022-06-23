import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectElement, getProjectElementIdentifier } from '../project-element.model';

export type EntityResponseType = HttpResponse<IProjectElement>;
export type EntityArrayResponseType = HttpResponse<IProjectElement[]>;

@Injectable({ providedIn: 'root' })
export class ProjectElementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-elements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projectElement: IProjectElement): Observable<EntityResponseType> {
    return this.http.post<IProjectElement>(this.resourceUrl, projectElement, { observe: 'response' });
  }

  update(projectElement: IProjectElement): Observable<EntityResponseType> {
    return this.http.put<IProjectElement>(`${this.resourceUrl}/${getProjectElementIdentifier(projectElement) as number}`, projectElement, {
      observe: 'response',
    });
  }

  partialUpdate(projectElement: IProjectElement): Observable<EntityResponseType> {
    return this.http.patch<IProjectElement>(
      `${this.resourceUrl}/${getProjectElementIdentifier(projectElement) as number}`,
      projectElement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProjectElement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProjectElement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProjectElementToCollectionIfMissing(
    projectElementCollection: IProjectElement[],
    ...projectElementsToCheck: (IProjectElement | null | undefined)[]
  ): IProjectElement[] {
    const projectElements: IProjectElement[] = projectElementsToCheck.filter(isPresent);
    if (projectElements.length > 0) {
      const projectElementCollectionIdentifiers = projectElementCollection.map(
        projectElementItem => getProjectElementIdentifier(projectElementItem)!
      );
      const projectElementsToAdd = projectElements.filter(projectElementItem => {
        const projectElementIdentifier = getProjectElementIdentifier(projectElementItem);
        if (projectElementIdentifier == null || projectElementCollectionIdentifiers.includes(projectElementIdentifier)) {
          return false;
        }
        projectElementCollectionIdentifiers.push(projectElementIdentifier);
        return true;
      });
      return [...projectElementsToAdd, ...projectElementCollection];
    }
    return projectElementCollection;
  }
}
