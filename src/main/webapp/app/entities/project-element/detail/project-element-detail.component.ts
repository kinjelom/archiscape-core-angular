import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjectElement } from '../project-element.model';

@Component({
  selector: 'jhi-project-element-detail',
  templateUrl: './project-element-detail.component.html',
})
export class ProjectElementDetailComponent implements OnInit {
  projectElement: IProjectElement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectElement }) => {
      this.projectElement = projectElement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
