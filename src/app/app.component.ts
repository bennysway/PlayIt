import {ChangeDetectorRef, Component} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import * as firebase from "firebase";
import {UtilProvider} from "../providers/util/util";
import {CollectionReference, DocumentReference} from "angularfire2/firestore";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage:any = HomePage;
  profileRef: DocumentReference;
  channelCollection: CollectionReference;
  playlistCollection: CollectionReference;
  playItName : string = "PlayIter Unknown";
  djName : string;

  public playlists :Array<string> = [];


  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              events: Events,
              private util : UtilProvider,
              private cd : ChangeDetectorRef) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('signInSuccess',() => {
      console.log("Loading user data");
      this.loadUserData();
    });
  }

  addPlaylist(){
    this.util.showPrompt(
      'New Playlist',
      'Create a name for your new playlist',
      'Chill Hits',
      'Create',
      'Cancel'
    ).then(data =>{
      if(this.playlists.indexOf(data) > -1){
        this.util.showToast(data + " already exists.");
      }
      else {
        this.playlists.push(data);
        this.playlistCollection.doc(data).set({});
      }
    })
  }
  loadUserData(){
    if(firebase.auth().currentUser){
      let db = firebase.firestore();
      let settings = {timestampsInSnapshots: true};
      db.settings(settings);
      //
      let id = firebase.auth().currentUser.uid;
      this.profileRef = db.doc('users/' + id);
      this.playlistCollection = db.collection('playlists/' + id + '/personal');
      this.channelCollection = db.collection('channels/' + id + '/favorite');

      this.profileRef.get()
        .then(doc => {
          if(!doc.exists){
            this.createUserDoc();
          }
          else {
            this.loadUserDoc(doc.get('name'));
            this.loadPlaylists();
            //this.loadChannels();
          }
        })
    }
  }

  createUserDoc(){
    this.util.showPrompt("New User",
      'Enter your new PlayIt Name',
      'Ashley Quinn',
      'Save',
      'Cancel')
      .then(data => {
        this.playItName = data;
        this.profileRef.set({
          name : data,
          djname : "DJ Unknown"
        });
      })
      .catch(() =>{
        this.profileRef.set({
          name : "PlayIter Unknown",
          djname : "DJ Unknown"
        });
      })
  }
  loadUserDoc(doc){
    this.playItName = doc;
  }
  loadPlaylists(){
    this.playlistCollection.get()
      .then(data => {
        data.forEach(doc =>{
          this.playlists.push(doc.id);
          this.cd.detectChanges();
        })
      })
  }
}

