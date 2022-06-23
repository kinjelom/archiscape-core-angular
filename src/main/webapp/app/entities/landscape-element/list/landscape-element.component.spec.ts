import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LandscapeElementService } from '../service/landscape-element.service';

import { LandscapeElementComponent } from './landscape-element.component';

describe('LandscapeElement Management Component', () => {
  let comp: LandscapeElementComponent;
  let fixture: ComponentFixture<LandscapeElementComponent>;
  let service: LandscapeElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'landscape-element', component: LandscapeElementComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [LandscapeElementComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
          },
        },
      ],
    })
      .overrideTemplate(LandscapeElementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandscapeElementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LandscapeElementService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 'ABC' }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.landscapeElements?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  it('should load a page', () => {
    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.landscapeElements?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
  });

  it('should calculate the sort attribute for an id', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalledWith(expect.objectContaining({ sort: ['id,desc'] }));
  });

  it('should calculate the sort attribute for a non-id attribute', () => {
    // INIT
    comp.ngOnInit();

    // GIVEN
    comp.predicate = 'name';

    // WHEN
    comp.loadPage(1);

    // THEN
    expect(service.query).toHaveBeenLastCalledWith(expect.objectContaining({ sort: ['name,desc', 'id'] }));
  });
});
