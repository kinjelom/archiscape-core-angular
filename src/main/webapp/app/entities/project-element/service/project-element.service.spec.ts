import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ElementType } from 'app/entities/enumerations/element-type.model';
import { IProjectElement, ProjectElement } from '../project-element.model';

import { ProjectElementService } from './project-element.service';

describe('ProjectElement Service', () => {
  let service: ProjectElementService;
  let httpMock: HttpTestingController;
  let elemDefault: IProjectElement;
  let expectedResult: IProjectElement | IProjectElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectElementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      type: ElementType.C4_PERSON,
      documentation: 'AAAAAAA',
      landscapeElementId: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProjectElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProjectElement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          type: 'BBBBBB',
          documentation: 'BBBBBB',
          landscapeElementId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectElement', () => {
      const patchObject = Object.assign(
        {
          type: 'BBBBBB',
          landscapeElementId: 'BBBBBB',
        },
        new ProjectElement()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          type: 'BBBBBB',
          documentation: 'BBBBBB',
          landscapeElementId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProjectElement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProjectElementToCollectionIfMissing', () => {
      it('should add a ProjectElement to an empty array', () => {
        const projectElement: IProjectElement = { id: 123 };
        expectedResult = service.addProjectElementToCollectionIfMissing([], projectElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectElement);
      });

      it('should not add a ProjectElement to an array that contains it', () => {
        const projectElement: IProjectElement = { id: 123 };
        const projectElementCollection: IProjectElement[] = [
          {
            ...projectElement,
          },
          { id: 456 },
        ];
        expectedResult = service.addProjectElementToCollectionIfMissing(projectElementCollection, projectElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectElement to an array that doesn't contain it", () => {
        const projectElement: IProjectElement = { id: 123 };
        const projectElementCollection: IProjectElement[] = [{ id: 456 }];
        expectedResult = service.addProjectElementToCollectionIfMissing(projectElementCollection, projectElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectElement);
      });

      it('should add only unique ProjectElement to an array', () => {
        const projectElementArray: IProjectElement[] = [{ id: 123 }, { id: 456 }, { id: 63851 }];
        const projectElementCollection: IProjectElement[] = [{ id: 123 }];
        expectedResult = service.addProjectElementToCollectionIfMissing(projectElementCollection, ...projectElementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectElement: IProjectElement = { id: 123 };
        const projectElement2: IProjectElement = { id: 456 };
        expectedResult = service.addProjectElementToCollectionIfMissing([], projectElement, projectElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectElement);
        expect(expectedResult).toContain(projectElement2);
      });

      it('should accept null and undefined values', () => {
        const projectElement: IProjectElement = { id: 123 };
        expectedResult = service.addProjectElementToCollectionIfMissing([], null, projectElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectElement);
      });

      it('should return initial array if no ProjectElement is added', () => {
        const projectElementCollection: IProjectElement[] = [{ id: 123 }];
        expectedResult = service.addProjectElementToCollectionIfMissing(projectElementCollection, undefined, null);
        expect(expectedResult).toEqual(projectElementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
