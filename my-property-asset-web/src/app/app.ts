import { Component, inject, OnInit } from '@angular/core';

import { DocumentTitleService } from '../infrastructure/utilities';
import { RootLayoutComponent } from '../layouts/root/root-layout.component';

@Component({
  selector: 'app-root',
  imports: [RootLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly documentTitle = inject(DocumentTitleService);

  ngOnInit(): void {
    this.documentTitle.reset();
  }
}
