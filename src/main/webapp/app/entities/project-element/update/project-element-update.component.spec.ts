import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectElementService } from '../service/project-element.service';
import { IProjectElement, ProjectElement } from '../project-element.model';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { ProjectElementUpdateComponent } from './project-element-update.component';

describe('ProjectElement Management Update Component', () => {
  let comp: ProjectElementUpdateComponent;
  let fixture: ComponentFixture<ProjectElementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectElementService: ProjectElementService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectElementUpdateComponent],
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
      .overrideTemplate(ProjectElementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectElementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectElementService = TestBed.inject(ProjectElementService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const projectElement: IProjectElement = { id: 456 };
      const project: IProject = { id: 55262 };
      projectElement.project = project;

      const projectCollection: IProject[] = [{ id: 51178 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectElement });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projectElement: IProjectElement = { id: 456 };
      const project: IProject = { id: 38791 };
      projectElement.project = project;

      activatedRoute.data = of({ projectElement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(projectElement));
      expect(comp.projectsSharedCollection).toContain(project);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectElement>>();
      const projectElement = { id: 123 };
      jest.spyOn(projectElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectElement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectElementService.update).toHaveBeenCalledWith(projectElement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectElement>>();
      const projectElement = new ProjectElement();
      jest.spyOn(projectElementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectElement }));
      saveSubject.complete();

      // THEN
      expect(projectElementService.create).toHaveBeenCalledWith(projectElement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectElement>>();
      const projectElement = { id: 123 };
      jest.spyOn(projectElementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectElement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectElementService.update).toHaveBeenCalledWith(projectElement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProjectById', () => {
      it('Should return tracked Project primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
