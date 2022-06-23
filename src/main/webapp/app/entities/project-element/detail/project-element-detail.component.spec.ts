import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectElementDetailComponent } from './project-element-detail.component';

describe('ProjectElement Management Detail Component', () => {
  let comp: ProjectElementDetailComponent;
  let fixture: ComponentFixture<ProjectElementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectElementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ projectElement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProjectElementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProjectElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load projectElement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.projectElement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
