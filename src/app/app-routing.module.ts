import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SoundComponent } from './sound/sound.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AudioService } from './services/audio.service';
import { AccountComponent } from './account/account.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './profile/profile.component';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent 
  },
  {
    path: 'about',
    component: AboutComponent
  }, 
  {
    path: 'profile',
    component: ProfileComponent
  }, 
  {
    path: 'sound/:id',
    component: SoundComponent,
    resolve: {
      sound: AudioService
    }
  },
  {
    path: '',
    loadChildren: async () => (await import('./audio/audio.module')).AudioModule
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
