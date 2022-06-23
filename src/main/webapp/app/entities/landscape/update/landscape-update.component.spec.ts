import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandscapeService } from '../service/landscape.service';
import { ILandscape, Landscape } from '../landscape.model';

import { LandscapeUpdateComponent } from './landscape-update.component';

describe('Landscape Management Update Component', () => {
  let comp: LandscapeUpdateComponent;
  let fixture: ComponentFixture<LandscapeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landscapeService: LandscapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandscapeUpdateComponent],
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
      .overrideTemplate(LandscapeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandscapeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landscapeService = TestBed.inject(LandscapeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const landscape: ILandscape = { id: 'CBA' };

      activatedRoute.data = of({ landscape });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(landscape));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Landscape>>();
      const landscape = { id: 'ABC' };
      jest.spyOn(landscapeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landscape }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(landscapeService.update).toHaveBeenCalledWith(landscape);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Landscape>>();
      const landscape = new Landscape();
      jest.spyOn(landscapeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landscape }));
      saveSubject.complete();

      // THEN
      expect(landscapeService.create).toHaveBeenCalledWith(landscape);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Landscape>>();
      const landscape = { id: 'ABC' };
      jest.spyOn(landscapeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscape });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landscapeService.update).toHaveBeenCalledWith(landscape);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
