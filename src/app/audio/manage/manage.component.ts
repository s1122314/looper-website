import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AudioService } from 'src/app/services/audio.service';
import ISound from 'src/app/models/audio.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit{
  soundOrder = '1';
  sounds: ISound[] = []
  activeSound : ISound | null = null
  sort$: BehaviorSubject<string>

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private audioService: AudioService,
    private modal: ModalService
    ) {
      this.sort$ = new BehaviorSubject(this.soundOrder)
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.soundOrder = params['sort'] === '2' ? params['sort'] : 1;
      this.sort$.next(this.soundOrder)
    })
    this.audioService.getUserSounds(this.sort$).subscribe(docs => {
      this.sounds = []

      docs.forEach(doc => {
        this.sounds.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement)

    this.router.navigate([], {
      relativeTo: this.route, 
      queryParams: {
        sort: value
      }
    })
  }

  openModal($event: Event, sound: ISound){
    $event.preventDefault()

    this.activeSound = sound
    
    this.modal.toggleModal('editSound')
  }

  update($event: ISound) {
    this.sounds.forEach((element, index) => {
      if(element.docID == $event.docID) {
        this.sounds[index].title = $event.title
      }
    })
  }
  
  deleteSound($event: Event, sound: ISound) {
    $event.preventDefault()

    this.audioService.deleteSound(sound)

    this.sounds.forEach((element, index) => {
      if(element.docID == sound.docID) {
        this.sounds.splice(index, 1)
      }
    })
  }

  async copyToClipboard($event: MouseEvent, docID: string | undefined) {
    $event.preventDefault()

    if(!docID) {
      return 
    }

    const url = `${location.origin}/sound/${docID}`

    await navigator.clipboard.writeText(url)

    alert('Link copied!')
  }
}
