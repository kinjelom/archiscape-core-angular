import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILandscape, Landscape } from '../landscape.model';

import { LandscapeService } from './landscape.service';

describe('Landscape Service', () => {
  let service: LandscapeService;
  let httpMock: HttpTestingController;
  let elemDefault: ILandscape;
  let expectedResult: ILandscape | ILandscape[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LandscapeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 'AAAAAAA',
      description: 'AAAAAAA',
      configuration: 'AAAAAAA',
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

    it('should create a Landscape', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Landscape()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Landscape', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          configuration: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Landscape', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          configuration: 'BBBBBB',
        },
        new Landscape()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Landscape', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          description: 'BBBBBB',
          configuration: 'BBBBBB',
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

    it('should delete a Landscape', () => {
      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLandscapeToCollectionIfMissing', () => {
      it('should add a Landscape to an empty array', () => {
        const landscape: ILandscape = { id: 'ABC' };
        expectedResult = service.addLandscapeToCollectionIfMissing([], landscape);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landscape);
      });

      it('should not add a Landscape to an array that contains it', () => {
        const landscape: ILandscape = { id: 'ABC' };
        const landscapeCollection: ILandscape[] = [
          {
            ...landscape,
          },
          { id: 'CBA' },
        ];
        expectedResult = service.addLandscapeToCollectionIfMissing(landscapeCollection, landscape);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Landscape to an array that doesn't contain it", () => {
        const landscape: ILandscape = { id: 'ABC' };
        const landscapeCollection: ILandscape[] = [{ id: 'CBA' }];
        expectedResult = service.addLandscapeToCollectionIfMissing(landscapeCollection, landscape);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landscape);
      });

      it('should add only unique Landscape to an array', () => {
        const landscapeArray: ILandscape[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '8c523726-b' }];
        const landscapeCollection: ILandscape[] = [{ id: 'ABC' }];
        expectedResult = service.addLandscapeToCollectionIfMissing(landscapeCollection, ...landscapeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const landscape: ILandscape = { id: 'ABC' };
        const landscape2: ILandscape = { id: 'CBA' };
        expectedResult = service.addLandscapeToCollectionIfMissing([], landscape, landscape2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landscape);
        expect(expectedResult).toContain(landscape2);
      });

      it('should accept null and undefined values', () => {
        const landscape: ILandscape = { id: 'ABC' };
        expectedResult = service.addLandscapeToCollectionIfMissing([], null, landscape, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landscape);
      });

      it('should return initial array if no Landscape is added', () => {
        const landscapeCollection: ILandscape[] = [{ id: 'ABC' }];
        expectedResult = service.addLandscapeToCollectionIfMissing(landscapeCollection, undefined, null);
        expect(expectedResult).toEqual(landscapeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
