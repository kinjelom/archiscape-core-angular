import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandscapeElementDetailComponent } from './landscape-element-detail.component';

describe('LandscapeElement Management Detail Component', () => {
  let comp: LandscapeElementDetailComponent;
  let fixture: ComponentFixture<LandscapeElementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandscapeElementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ landscapeElement: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(LandscapeElementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandscapeElementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load landscapeElement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.landscapeElement).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
