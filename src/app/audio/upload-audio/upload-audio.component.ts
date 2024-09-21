import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import  firebase from 'firebase/compat/app';
import { AudioService } from 'src/app/services/audio.service';
import { Router } from '@angular/router'
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import IUser from 'src/app/models/user.model';



@Component({
  selector: 'app-uploadAudio',
  templateUrl: './upload-audio.component.html',
  styleUrls: ['./upload-audio.component.css']
})
export class UploadAudioComponent implements OnInit, OnDestroy{
    public usersCollection: AngularFirestoreCollection<IUser>
    isDragover = false
    file: File | null = null
    nextStep = false
    showAlert = false
    alertColor = 'blue'
    alertMsg = 'Please wait! Your audio is being uploaded.'
    inSubmission = false
    percentage = 0
    showPercentage = false
    user: firebase.User  | null = null
    userModel?: IUser
    task?: AngularFireUploadTask
    screenshots: string[] = []
    selectedScreenshot = ''
    screenshotTask?: AngularFireUploadTask      
    genres: string[] = [
      'Pop',
      'Rock',
      'Rap',
      'Classical',
      'EDM',
      'Country',
      'Latin',
      'Jazz',
      'Other'
    ]
    selectedGenre = ''
    scales: string[] = [
      'Minor',
      'Major',
    ]
    selectedScale = ''
    keys: string[] = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]
    selectedKey = ''


    title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
    })

    genre = new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3)
      ],
      nonNullable: true
      })

    bpm = new FormControl('', {
      validators: [
        Validators.minLength(2)
      ],
      nonNullable: true
      })

    key = new FormControl('', {
      validators: [
        Validators.minLength(2)
      ],
      nonNullable: true
      })

  

    uploadForm = new FormGroup({
      title: this.title,
      genre: this.genre,
      bpm: this.bpm,
      key: this.key
    })

      constructor(
        private storage: AngularFireStorage,
        private auth: AngularFireAuth,
        private audioService: AudioService,
        private router: Router,
        private db: AngularFirestore,
        public ffmpegService: FfmpegService
        ) {
          console.log('User Loaded:', this.userModel);
          this.ffmpegService.init()         
          auth.user.subscribe(userModel => this.user = userModel)
          this.usersCollection = this.db.collection('users')
          
        }

        ngOnInit(): void {
          this.auth.user.subscribe(userModel => {
            if (userModel) {
              this.user = userModel;
        
              this.usersCollection.doc<IUser>(userModel.uid).valueChanges().subscribe(userData => {
                this.userModel = userData;
              });
            }
          })
        }
   
      ngOnDestroy(): void {   
        this.task?.cancel()
      }
      

      async storeFile($event: Event) {
        if(this.ffmpegService.isRunning) {
          return 
        }

        this.isDragover = false

        this.file = ($event as DragEvent).dataTransfer ? 
        ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
        ($event.target as HTMLInputElement).files?.item(0) ?? null

      if(!this.file || this.file.type !== 'audio/mpeg'){
        return 
      }

        this.title.setValue(
          this.file.name.replace(/\.[^/.]+$/, '')
        )
        this.nextStep = true
      }

      async uploadFile() {
        this.uploadForm.disable()

        this.showAlert = true
        this.alertColor = 'blue'
        this.alertMsg = 'Please wait! Your audio is being uploaded.'
        this.inSubmission = true
        this.showPercentage = true


        const audioFileName = uuid()
        const audioPath = `audio/${audioFileName}.mp3`

        this.task = this.storage.upload(audioPath, this.file)
        const audioRef = this.storage.ref(audioPath)

        combineLatest([
          this.task.percentageChanges(),
        ]).subscribe((progress) => {
          const [audioProgress] = progress

          if(!audioProgress){
            return 
          }

          const total = audioProgress

          this.percentage = total as number / 100
        })

        forkJoin([
          this.task.snapshotChanges(),
        ]).pipe(
          switchMap(() => forkJoin([
            audioRef.getDownloadURL(),
          ]))
        ).subscribe({
          next: async (urls) => {
            const [soundURL] = urls

          let instagramValue = this.userModel?.instagram as string
          let spotifyValue = this.userModel?.spotify as string

        
          if (instagramValue === undefined) {
            instagramValue =  ''
          }

          if (spotifyValue === undefined) {
            spotifyValue =  ''
          }
          
            const sound = {
              uid: this.user?.uid as string,
              displayName: this.user?.displayName as string,
              email: this.user?.email as string,
              instagram: instagramValue,
              spotify: spotifyValue,
              title: this.title.value,
              genre: this.selectedGenre,
              bpm: this.bpm.value,
              key: this.selectedKey + ' ' + this.selectedScale,
              fileName: `${audioFileName}.mp3`,
              url: soundURL,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }

            const soundDocRef = await this.audioService.createSound(sound)

            console.log(sound)

            this.alertColor = 'green'
            this.alertMsg = 'Succes! Your sound is now ready to share with the world.'
            this.showPercentage = false

            setTimeout(() => {
              this.router.navigate([
                'sound', soundDocRef.id
              ])
            }, 1000)
          },
         
          error: (error) => {
            this.uploadForm.enable()

            this.alertColor = 'red'
            this.alertMsg = 'Upload failed! Please try again later.'
            this.inSubmission = true
            this.showPercentage = false
            console.error(error)
          }
        }
        )
      }
}
