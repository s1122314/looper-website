import firebase from 'firebase/compat/app'

export default interface ISound {
    docID?: string;
    uid: string;
    displayName: string;
    email: string;
    instagram: string;
    spotify: string;
    title: string;
    genre: string;
    bpm: string;
    key: string;
    fileName: string;
    url: string;
    timestamp: firebase.firestore.FieldValue;
}