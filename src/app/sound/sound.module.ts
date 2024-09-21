import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlModalComponent } from './url-modal/url-modal.component';




@NgModule({
  declarations: [
    UrlModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,

  ],
  exports: [
    UrlModalComponent
  ]
})
export class AudioModule { }
