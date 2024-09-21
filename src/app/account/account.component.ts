import { Component } from '@angular/core';
import IUser from '../models/user.model';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  user?: IUser

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      this.user = data.user as IUser
    })
  }
}
