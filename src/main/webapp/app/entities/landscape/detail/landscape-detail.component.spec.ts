import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LandscapeDetailComponent } from './landscape-detail.component';

describe('Landscape Management Detail Component', () => {
  let comp: LandscapeDetailComponent;
  let fixture: ComponentFixture<LandscapeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandscapeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ landscape: { id: 'ABC' } }) },
        },
      ],
    })
      .overrideTemplate(LandscapeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LandscapeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load landscape on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.landscape).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
