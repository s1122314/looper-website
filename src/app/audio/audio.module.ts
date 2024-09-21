import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioRoutingModule } from './audio-routing-module';
import { UploadAudioComponent } from './upload-audio/upload-audio.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { SafeURLPipe } from './pipes/safe-url.pipe';
import { ManageComponent } from './manage/manage.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';


@NgModule({
  declarations: [
    UploadAudioComponent,
    ManageComponent,
    EditComponent,
    SafeURLPipe
  ],
  imports: [
    CommonModule,
    AudioRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DropDownListModule
  ]
})
export class AudioModule { }
