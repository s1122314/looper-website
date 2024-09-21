import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation
 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import ISound from '../models/audio.model';
import { DatePipe } from '@angular/common';
import IUser from '../models/user.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import  firebase from 'firebase/compat/app';
import { AudioService } from 'src/app/services/audio.service';
import { Location } from '@angular/common';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-sound',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class SoundComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef
  player?: videojs.Player
  sound?: ISound
  user?: IUser
  FBuser: firebase.User  | null = null
  public usersCollection: AngularFirestoreCollection<IUser>
  currentUrl: string = '';

  constructor(
    public route: ActivatedRoute,
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private router: Router,
    private audioService: AudioService,
    private location: Location,
    public modal: ModalService,

    ) {
      auth.user.subscribe(user => this.FBuser = user)
      this.usersCollection = this.db.collection('users')
    }

  ngOnInit(): void {
    this.currentUrl = this.location.path();
    this.auth.user.subscribe(user => {
    if (user) {
      this.FBuser = user;

      // Retrieve additional user information, including Instagram
      this.usersCollection.doc<IUser>(user.uid).valueChanges().subscribe(userData => {
        this.user = userData;
      });
      }
    })

      // Initialize sound player with the sounds's URL
      this.player = videojs(this.target?.nativeElement);
      this.route.data.subscribe(data => {
        this.sound = data.sound as ISound;
        this.player?.src({
          src: this.sound.url,
          type: 'audio/mp3'
        });
      });
  
  
  }

  navigateToInstagram() {
    const instagramUrl = `https://instagram.com/${this.sound?.instagram}`;
    window.open(instagramUrl, '_blank'); // Open in a new tab/window
  }

  navigateToSpotify() {
    const spotifyUrl = `https://open.spotify.com/${this.sound?.spotify}`;
    window.open(spotifyUrl, '_blank'); // Open in a new tab/window
  }

  sendEmail() {
    const emailSubject = 'Hey, I just saw your music on Looper (example)';
    const emailBody = 'What do you want to sent? ';

    const mailtoLink = `mailto:${this.sound?.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open the user's default email client
    window.location.href = mailtoLink;
  }

  openModal($event: Event) {
    $event.preventDefault()

    this.modal.toggleModal('url')
  }

}


