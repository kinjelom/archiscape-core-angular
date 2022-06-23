import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITextFileContent } from '../text-file-content.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-text-file-content-detail',
  templateUrl: './text-file-content-detail.component.html',
})
export class TextFileContentDetailComponent implements OnInit {
  textFileContent: ITextFileContent | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ textFileContent }) => {
      this.textFileContent = textFileContent;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
