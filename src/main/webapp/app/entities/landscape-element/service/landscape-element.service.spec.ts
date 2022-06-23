import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ElementType } from 'app/entities/enumerations/element-type.model';
import { ILandscapeElement, LandscapeElement } from '../landscape-element.model';

import { LandscapeElementService } from './landscape-element.service';

describe('LandscapeElement Service', () => {
  let service: LandscapeElementService;
  let httpMock: HttpTestingController;
  let elemDefault: ILandscapeElement;
  let expectedResult: ILandscapeElement | ILandscapeElement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LandscapeElementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      type: ElementType.C4_PERSON,
      documentation: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a LandscapeElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LandscapeElement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LandscapeElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          type: 'BBBBBB',
          documentation: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LandscapeElement', () => {
      const patchObject = Object.assign({}, new LandscapeElement());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LandscapeElement', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          type: 'BBBBBB',
          documentation: 'BBBBBB',
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

    it('should delete a LandscapeElement', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLandscapeElementToCollectionIfMissing', () => {
      it('should add a LandscapeElement to an empty array', () => {
        const landscapeElement: ILandscapeElement = { id: 'ABC' };
        expectedResult = service.addLandscapeElementToCollectionIfMissing([], landscapeElement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landscapeElement);
      });

      it('should not add a LandscapeElement to an array that contains it', () => {
        const landscapeElement: ILandscapeElement = { id: 'ABC' };
        const landscapeElementCollection: ILandscapeElement[] = [
          {
            ...landscapeElement,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addLandscapeElementToCollectionIfMissing(landscapeElementCollection, landscapeElement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LandscapeElement to an array that doesn't contain it", () => {
        const landscapeElement: ILandscapeElement = { id: 'ABC' };
        const landscapeElementCollection: ILandscapeElement[] = [{ id: 'CBA' }];
        expectedResult = service.addLandscapeElementToCollectionIfMissing(landscapeElementCollection, landscapeElement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landscapeElement);
      });

      it('should add only unique LandscapeElement to an array', () => {
        const landscapeElementArray: ILandscapeElement[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'fdcccfb8-dce2-4220-a87f-6411a2' }];
        const landscapeElementCollection: ILandscapeElement[] = [{ id: 'ABC' }];
        expectedResult = service.addLandscapeElementToCollectionIfMissing(landscapeElementCollection, ...landscapeElementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const landscapeElement: ILandscapeElement = { id: 'ABC' };
        const landscapeElement2: ILandscapeElement = { id: 'CBA' };
        expectedResult = service.addLandscapeElementToCollectionIfMissing([], landscapeElement, landscapeElement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landscapeElement);
        expect(expectedResult).toContain(landscapeElement2);
      });

      it('should accept null and undefined values', () => {
        const landscapeElement: ILandscapeElement = { id: 'ABC' };
        expectedResult = service.addLandscapeElementToCollectionIfMissing([], null, landscapeElement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landscapeElement);
      });

      it('should return initial array if no LandscapeElement is added', () => {
        const landscapeElementCollection: ILandscapeElement[] = [{ id: 'ABC' }];
        expectedResult = service.addLandscapeElementToCollectionIfMissing(landscapeElementCollection, undefined, null);
        expect(expectedResult).toEqual(landscapeElementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
