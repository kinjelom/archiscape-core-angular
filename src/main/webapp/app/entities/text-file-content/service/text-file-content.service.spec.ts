import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITextFileContent, TextFileContent } from '../text-file-content.model';

import { TextFileContentService } from './text-file-content.service';

describe('TextFileContent Service', () => {
  let service: TextFileContentService;
  let httpMock: HttpTestingController;
  let elemDefault: ITextFileContent;
  let expectedResult: ITextFileContent | ITextFileContent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TextFileContentService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 'AAAAAAA',
      version: 0,
      insertDate: currentDate,
      fileName: 'AAAAAAA',
      content: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          insertDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TextFileContent', () => {
      const returnedFromService = Object.assign(
        {
          id: 'ID',
          insertDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          insertDate: currentDate,
        },
        returnedFromService
      );

      service.create(new TextFileContent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TextFileContent', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          version: 1,
          insertDate: currentDate.format(DATE_FORMAT),
          fileName: 'BBBBBB',
          content: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          insertDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TextFileContent', () => {
      const patchObject = Object.assign(
        {
          version: 1,
        },
        new TextFileContent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          insertDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TextFileContent', () => {
      const returnedFromService = Object.assign(
        {
          id: 'BBBBBB',
          version: 1,
          insertDate: currentDate.format(DATE_FORMAT),
          fileName: 'BBBBBB',
          content: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          insertDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TextFileContent', () => {
      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTextFileContentToCollectionIfMissing', () => {
      it('should add a TextFileContent to an empty array', () => {
        const textFileContent: ITextFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addTextFileContentToCollectionIfMissing([], textFileContent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textFileContent);
      });

      it('should not add a TextFileContent to an array that contains it', () => {
        const textFileContent: ITextFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const textFileContentCollection: ITextFileContent[] = [
          {
            ...textFileContent,
          },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
        ];
        expectedResult = service.addTextFileContentToCollectionIfMissing(textFileContentCollection, textFileContent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TextFileContent to an array that doesn't contain it", () => {
        const textFileContent: ITextFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const textFileContentCollection: ITextFileContent[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
        expectedResult = service.addTextFileContentToCollectionIfMissing(textFileContentCollection, textFileContent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textFileContent);
      });

      it('should add only unique TextFileContent to an array', () => {
        const textFileContentArray: ITextFileContent[] = [
          { id: '9fec3727-3421-4967-b213-ba36557ca194' },
          { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          { id: '4f3bc034-14aa-4581-badb-0f518d31f87c' },
        ];
        const textFileContentCollection: ITextFileContent[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addTextFileContentToCollectionIfMissing(textFileContentCollection, ...textFileContentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const textFileContent: ITextFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const textFileContent2: ITextFileContent = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        expectedResult = service.addTextFileContentToCollectionIfMissing([], textFileContent, textFileContent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(textFileContent);
        expect(expectedResult).toContain(textFileContent2);
      });

      it('should accept null and undefined values', () => {
        const textFileContent: ITextFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        expectedResult = service.addTextFileContentToCollectionIfMissing([], null, textFileContent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(textFileContent);
      });

      it('should return initial array if no TextFileContent is added', () => {
        const textFileContentCollection: ITextFileContent[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
        expectedResult = service.addTextFileContentToCollectionIfMissing(textFileContentCollection, undefined, null);
        expect(expectedResult).toEqual(textFileContentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
