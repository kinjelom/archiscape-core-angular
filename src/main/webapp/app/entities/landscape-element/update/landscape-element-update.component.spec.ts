import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandscapeElementService } from '../service/landscape-element.service';
import { ILandscapeElement, LandscapeElement } from '../landscape-element.model';
import { ILandscape } from 'app/entities/landscape/landscape.model';
import { LandscapeService } from 'app/entities/landscape/service/landscape.service';

import { LandscapeElementUpdateComponent } from './landscape-element-update.component';

describe('LandscapeElement Management Update Component', () => {
  let comp: LandscapeElementUpdateComponent;
  let fixture: ComponentFixture<LandscapeElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landscapeElementService: LandscapeElementService;
  let landscapeService: LandscapeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandscapeElementUpdateComponent],
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
      .overrideTemplate(LandscapeElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandscapeElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landscapeElementService = TestBed.inject(LandscapeElementService);
    landscapeService = TestBed.inject(LandscapeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Landscape query and add missing value', () => {
      const landscapeElement: ILandscapeElement = { id: 'CBA' };
      const landscape: ILandscape = { id: '5d741a7c-0' };
      landscapeElement.landscape = landscape;

      const landscapeCollection: ILandscape[] = [{ id: '4fa7d844-b' }];
      jest.spyOn(landscapeService, 'query').mockReturnValue(of(new HttpResponse({ body: landscapeCollection })));
      const additionalLandscapes = [landscape];
      const expectedCollection: ILandscape[] = [...additionalLandscapes, ...landscapeCollection];
      jest.spyOn(landscapeService, 'addLandscapeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ landscapeElement });
      comp.ngOnInit();

      expect(landscapeService.query).toHaveBeenCalled();
      expect(landscapeService.addLandscapeToCollectionIfMissing).toHaveBeenCalledWith(landscapeCollection, ...additionalLandscapes);
      expect(comp.landscapesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const landscapeElement: ILandscapeElement = { id: 'CBA' };
      const landscape: ILandscape = { id: '58989d53-7' };
      landscapeElement.landscape = landscape;

      activatedRoute.data = of({ landscapeElement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(landscapeElement));
      expect(comp.landscapesSharedCollection).toContain(landscape);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandscapeElement>>();
      const landscapeElement = { id: 'ABC' };
      jest.spyOn(landscapeElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscapeElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landscapeElement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(landscapeElementService.update).toHaveBeenCalledWith(landscapeElement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandscapeElement>>();
      const landscapeElement = new LandscapeElement();
      jest.spyOn(landscapeElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscapeElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landscapeElement }));
      saveSubject.complete();

      // THEN
      expect(landscapeElementService.create).toHaveBeenCalledWith(landscapeElement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandscapeElement>>();
      const landscapeElement = { id: 'ABC' };
      jest.spyOn(landscapeElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landscapeElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landscapeElementService.update).toHaveBeenCalledWith(landscapeElement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLandscapeById', () => {
      it('Should return tracked Landscape primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackLandscapeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
