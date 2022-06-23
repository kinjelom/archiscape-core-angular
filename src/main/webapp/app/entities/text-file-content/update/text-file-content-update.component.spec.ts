import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TextFileContentService } from '../service/text-file-content.service';
import { ITextFileContent, TextFileContent } from '../text-file-content.model';

import { TextFileContentUpdateComponent } from './text-file-content-update.component';

describe('TextFileContent Management Update Component', () => {
  let comp: TextFileContentUpdateComponent;
  let fixture: ComponentFixture<TextFileContentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let textFileContentService: TextFileContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TextFileContentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TextFileContentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TextFileContentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    textFileContentService = TestBed.inject(TextFileContentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const textFileContent: ITextFileContent = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

      activatedRoute.data = of({ textFileContent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(textFileContent));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextFileContent>>();
      const textFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(textFileContentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textFileContent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textFileContent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(textFileContentService.update).toHaveBeenCalledWith(textFileContent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextFileContent>>();
      const textFileContent = new TextFileContent();
      jest.spyOn(textFileContentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textFileContent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: textFileContent }));
      saveSubject.complete();

      // THEN
      expect(textFileContentService.create).toHaveBeenCalledWith(textFileContent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TextFileContent>>();
      const textFileContent = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(textFileContentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ textFileContent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(textFileContentService.update).toHaveBeenCalledWith(textFileContent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
