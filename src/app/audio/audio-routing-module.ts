import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadAudioComponent } from './upload-audio/upload-audio.component';
import { ManageComponent } from './manage/manage.component';

import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard' 

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/')

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    canActivate: [AngularFireAuthGuard]
  }, {
    path: 'upload',
    component: UploadAudioComponent,
    data: {
      authOnly: true,
      authGuardPipe: redirectUnauthorizedToHome
    },
    canActivate: [AngularFireAuthGuard]
  },
  {
    path: 'manage-audios',
    redirectTo: 'manage'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AudioRoutingModule { }
