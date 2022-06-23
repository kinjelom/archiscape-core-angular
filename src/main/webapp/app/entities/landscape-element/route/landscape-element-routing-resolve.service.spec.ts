import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILandscapeElement, LandscapeElement } from '../landscape-element.model';
import { LandscapeElementService } from '../service/landscape-element.service';

import { LandscapeElementRoutingResolveService } from './landscape-element-routing-resolve.service';

describe('LandscapeElement routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LandscapeElementRoutingResolveService;
  let service: LandscapeElementService;
  let resultLandscapeElement: ILandscapeElement | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(LandscapeElementRoutingResolveService);
    service = TestBed.inject(LandscapeElementService);
    resultLandscapeElement = undefined;
  });

  describe('resolve', () => {
    it('should return ILandscapeElement returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandscapeElement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLandscapeElement).toEqual({ id: 'ABC' });
    });

    it('should return new ILandscapeElement if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandscapeElement = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLandscapeElement).toEqual(new LandscapeElement());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LandscapeElement })));
      mockActivatedRouteSnapshot.params = { id: 'ABC' };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLandscapeElement = result;
      });

      // THEN
      expect(service.find).toBeCalledWith('ABC');
      expect(resultLandscapeElement).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
