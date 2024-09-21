import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import ISound from '../models/audio.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map, last } from 'rxjs/operators'
import { of, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AudioService implements Resolve<ISound | null> {
  public soundsCollection: AngularFirestoreCollection<ISound>
  pageSounds: ISound[] = []
  pendingReq = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) { 
    this.soundsCollection = db.collection('sounds')
  }

  async createSound(data: ISound) : Promise<DocumentReference<ISound>> {
    return this.soundsCollection.add(data)
  }

  getUserSounds(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values

        if(!user) {
          return of([])
        }

        const query = this.soundsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        )

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<ISound>).docs)
    )
  }

  getOtherUserSounds(userUid: string, sort$: BehaviorSubject<string>) {
    return sort$.pipe(
      switchMap(sort => {
        const query = this.soundsCollection.ref
          .where('displayName', '==', userUid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
  
        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<ISound>).docs)
    );
  }

  updateSound(id: string, title: string, genre: string, bpm: string, key: string) {
    return this.soundsCollection.doc(id).update({
      title,
      genre,
      bpm,
      key,
    }) 
  }

  async deleteSound(sound: ISound) {
    const soundRef = this.storage.ref(`audio/${sound.fileName}`)
 
    await soundRef.delete()

    await this.soundsCollection.doc(sound.docID).delete()
  }

  async getSounds() {
    if(this.pendingReq) {
      return 
    }

    this.pendingReq = true
    let query = this.soundsCollection.ref.orderBy(
      'timestamp', 'desc'
      ).limit(6)

      const { length } = this.pageSounds

      if(length) {
        const lastDocID = this.pageSounds[length - 1].docID
        const lastDoc = await this.soundsCollection.doc(lastDocID)
          .get()
          .toPromise()

        query = query.startAfter(lastDoc)
      }
      const snapshot = await query.get()

      snapshot.forEach(doc => {
        this.pageSounds.push({
          docID: doc.id,
          ...doc.data()
        })
      })

      this.pendingReq = false
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.soundsCollection.doc(route.params.id)
      .get()
      .pipe(
        map(snapshot => {
          const data = snapshot.data()

          if (!data) {
            this.router.navigate(['/'])
            return null
          }

          return data
        })
      )
  }

  
  
}
