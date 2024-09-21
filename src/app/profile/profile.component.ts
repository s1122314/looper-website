import { Component, OnInit } from '@angular/core';
import  firebase from 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  user?: IUser
  FBuser: firebase.User  | null = null
  public usersCollection: AngularFirestoreCollection<IUser>
  activeUser : IUser | null = null

  users: IUser[] = []

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    ){
      auth.user.subscribe(user => this.FBuser = user)
      this.usersCollection = this.db.collection('users')
    }

    ngOnInit(): void {
      this.auth.user.subscribe(user => {
        if (user) {
          this.FBuser = user;
    
          this.usersCollection.doc<IUser>(user.uid).valueChanges().subscribe(userData => {
            this.user = userData;
          });
          }
      }
    
  )}

}
