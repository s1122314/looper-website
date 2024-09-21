import { 
  Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output,
  EventEmitter 
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import ISound from 'src/app/models/audio.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{
  @Input() activeSound: ISound | null  = null
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating audio.'
  @Output() update = new EventEmitter()

  soundID = new FormControl('', {
    nonNullable: true
  })

  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
    })
    
    editForm = new FormGroup({
      title: this.title,
      id: this.soundID
    })

  constructor(
    private modal: ModalService,
    private audioService: AudioService
    ) {}

  ngOnInit(): void {
    this.modal.register('editProfile')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editProfile')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeSound){
      return
    }

    this.inSubmission = false
    this.showAlert = false
    this.soundID.setValue(this.activeSound.docID as string)
    this.title.setValue(this.activeSound.title)
  }

  async submit() {
    if(!this.activeSound) {
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating audio'

    try {
      await this.audioService.updateSound(
        this.soundID.value, this.title.value
      ) 
    }
    catch(e) {
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = 'Something went wrong. Try again later! '
      return
    }

    this.activeSound.title = this.title.value
    this.update.emit(this.activeSound)

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Succes!'
  }
}
