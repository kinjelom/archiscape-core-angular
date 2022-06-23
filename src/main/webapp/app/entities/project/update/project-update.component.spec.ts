import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectService } from '../service/project.service';
import { IProject, Project } from '../project.model';
import { ILandscape } from 'app/entities/landscape/landscape.model';
import { LandscapeService } from 'app/entities/landscape/service/landscape.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

import { ProjectUpdateComponent } from './project-update.component';

describe('Project Management Update Component', () => {
  let comp: ProjectUpdateComponent;
  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectService: ProjectService;
  let landscapeService: LandscapeService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectUpdateComponent],
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
      .overrideTemplate(ProjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectService = TestBed.inject(ProjectService);
    landscapeService = TestBed.inject(LandscapeService);
    teamService = TestBed.inject(TeamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Landscape query and add missing value', () => {
      const project: IProject = { id: 456 };
      const landscape: ILandscape = { id: '4f370249-f' };
      project.landscape = landscape;

      const landscapeCollection: ILandscape[] = [{ id: '80aab556-d' }];
      jest.spyOn(landscapeService, 'query').mockReturnValue(of(new HttpResponse({ body: landscapeCollection })));
      const additionalLandscapes = [landscape];
      const expectedCollection: ILandscape[] = [...additionalLandscapes, ...landscapeCollection];
      jest.spyOn(landscapeService, 'addLandscapeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(landscapeService.query).toHaveBeenCalled();
      expect(landscapeService.addLandscapeToCollectionIfMissing).toHaveBeenCalledWith(landscapeCollection, ...additionalLandscapes);
      expect(comp.landscapesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Team query and add missing value', () => {
      const project: IProject = { id: 456 };
      const team: ITeam = { id: '7f0de068-90e9-4725-8677-b47325' };
      project.team = team;

      const teamCollection: ITeam[] = [{ id: 'bbebb104-7e81-4751-92da-cfd411' }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(teamCollection, ...additionalTeams);
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const project: IProject = { id: 456 };
      const landscape: ILandscape = { id: '9be3aca3-a' };
      project.landscape = landscape;
      const team: ITeam = { id: '83e448e0-42b9-411c-a71c-ee6132' };
      project.team = team;

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(project));
      expect(comp.landscapesSharedCollection).toContain(landscape);
      expect(comp.teamsSharedCollection).toContain(team);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = { id: 123 };
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectService.update).toHaveBeenCalledWith(project);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = new Project();
      jest.spyOn(projectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectService.create).toHaveBeenCalledWith(project);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Project>>();
      const project = { id: 123 };
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectService.update).toHaveBeenCalledWith(project);
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

    describe('trackTeamById', () => {
      it('Should return tracked Team primary key', () => {
        const entity = { id: 'ABC' };
        const trackResult = comp.trackTeamById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
