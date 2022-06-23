import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILandscape } from '../landscape.model';

@Component({
  selector: 'jhi-landscape-detail',
  templateUrl: './landscape-detail.component.html',
})
export class LandscapeDetailComponent implements OnInit {
  landscape: ILandscape | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landscape }) => {
      this.landscape = landscape;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
