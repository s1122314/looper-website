import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-url-modal',
  templateUrl: './url-modal.component.html',
  styleUrls: ['./url-modal.component.css']
})
export class UrlModalComponent implements OnInit, OnDestroy{
  currentUrl: string = '';

  constructor(
    public modal: ModalService,
    private location: Location
    ) {}

  ngOnInit(): void {
    this.currentUrl = this.location.path();
    this.modal.register('url')
  }

  ngOnDestroy(): void {
    this.modal.unregister('url')
  }
}
