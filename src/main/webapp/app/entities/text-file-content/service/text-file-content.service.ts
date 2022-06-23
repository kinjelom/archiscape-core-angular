import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITextFileContent, getTextFileContentIdentifier } from '../text-file-content.model';

export type EntityResponseType = HttpResponse<ITextFileContent>;
export type EntityArrayResponseType = HttpResponse<ITextFileContent[]>;

@Injectable({ providedIn: 'root' })
export class TextFileContentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/text-file-contents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(textFileContent: ITextFileContent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(textFileContent);
    return this.http
      .post<ITextFileContent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(textFileContent: ITextFileContent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(textFileContent);
    return this.http
      .put<ITextFileContent>(`${this.resourceUrl}/${getTextFileContentIdentifier(textFileContent) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(textFileContent: ITextFileContent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(textFileContent);
    return this.http
      .patch<ITextFileContent>(`${this.resourceUrl}/${getTextFileContentIdentifier(textFileContent) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ITextFileContent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITextFileContent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTextFileContentToCollectionIfMissing(
    textFileContentCollection: ITextFileContent[],
    ...textFileContentsToCheck: (ITextFileContent | null | undefined)[]
  ): ITextFileContent[] {
    const textFileContents: ITextFileContent[] = textFileContentsToCheck.filter(isPresent);
    if (textFileContents.length > 0) {
      const textFileContentCollectionIdentifiers = textFileContentCollection.map(
        textFileContentItem => getTextFileContentIdentifier(textFileContentItem)!
      );
      const textFileContentsToAdd = textFileContents.filter(textFileContentItem => {
        const textFileContentIdentifier = getTextFileContentIdentifier(textFileContentItem);
        if (textFileContentIdentifier == null || textFileContentCollectionIdentifiers.includes(textFileContentIdentifier)) {
          return false;
        }
        textFileContentCollectionIdentifiers.push(textFileContentIdentifier);
        return true;
      });
      return [...textFileContentsToAdd, ...textFileContentCollection];
    }
    return textFileContentCollection;
  }

  protected convertDateFromClient(textFileContent: ITextFileContent): ITextFileContent {
    return Object.assign({}, textFileContent, {
      insertDate: textFileContent.insertDate?.isValid() ? textFileContent.insertDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.insertDate = res.body.insertDate ? dayjs(res.body.insertDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((textFileContent: ITextFileContent) => {
        textFileContent.insertDate = textFileContent.insertDate ? dayjs(textFileContent.insertDate) : undefined;
      });
    }
    return res;
  }
}
