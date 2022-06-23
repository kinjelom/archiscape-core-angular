import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILandscapeElement } from '../landscape-element.model';

@Component({
  selector: 'jhi-landscape-element-detail',
  templateUrl: './landscape-element-detail.component.html',
})
export class LandscapeElementDetailComponent implements OnInit {
  landscapeElement: ILandscapeElement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ landscapeElement }) => {
      this.landscapeElement = landscapeElement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
