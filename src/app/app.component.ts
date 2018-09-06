import {ChangeDetectorRef, Component} from '@angular/core';
import {Events, MenuController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import * as firebase from "firebase";
import {UtilProvider} from "../providers/util/util";
import {command} from "./models/command-interface";
import {SongObject} from "./models/song-model";
import {firebaseAuth} from "./app.module";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  loggedIn : boolean = false;
  rootPage:any = HomePage;
  profileRef: firebase.firestore.DocumentReference;
  commandCollection: firebase.firestore.CollectionReference;
  channelCollection: firebase.firestore.CollectionReference;
  playlistCollection: firebase.firestore.CollectionReference;
  playItName : string = "PlayIter Unknown";
  djName : string;

  public playlists :Array<string> = [];


  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public events: Events,
              private util : UtilProvider,
              private cd : ChangeDetectorRef,
              public menu : MenuController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      firebase.initializeApp(firebaseAuth);
    });

    events.subscribe('signInSuccess',() => {
      console.log("Loading user data");
      this.loggedIn = true;
      this.loadUserData();
    });
    events.subscribe('addToPlaylist', (id,title) =>{
      if(this.loggedIn)
        this.addSongToPlaylist(id,title);
    });
    events.subscribe('playlist:update',  ([playlist,playlistName]) => this.updatePlaylist(playlist,playlistName));
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
        this.playlistCollection.doc(data).set({
          songs : []
        });
      }
    })
  }
  addSongToPlaylist(id:string,title:string){
    this.util.showSelectList('Select a playlist for ' + title,this.playlists)
      .then(data => {
        if(data && data!=""){
          this.playlistCollection.doc(data).get()
            .then(playlistData =>{
              let songs = playlistData.get('songs');
              let added = false;
              let count = 0;
              songs.forEach(song => {
                if(song.id == id){
                  added = true;
                  this.util.showToast('Song already exists');
                }
                count++;
              });
              if(!added){
                songs.push({
                  id : id,
                  title :title,
                });
                this.playlistCollection.doc(data).set({songs})
                  .then(() =>{this.util.showToast('Added!');})
                  .catch(e => console.log(e));
              }
            });
        }
      });
  }
  updatePlaylist(songs : SongObject[],playlistName : string,){
    this.playlistCollection.doc(playlistName).set({songs})
      .then(() =>{this.util.showToast('Updated!');})
      .catch(e => console.log(e));
  }


  loadUserData(){
    if(firebase.auth().currentUser){
      let db = firebase.firestore();
      let settings = {timestampsInSnapshots: true};
      db.settings(settings);
      //
      let id = firebase.auth().currentUser.uid;
      this.profileRef = db.doc('users/' + id);
      this.commandCollection = db.collection('users/' + id + '/commands');
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
            this.setupCommandListener();

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
          myQuote : "",
          settings : {
            djName: 'Dj Unknown',
            skipValue: 5,
            anthem : ""
          }
        });
      })
      .catch(() =>{
        this.profileRef.set({
          name : "PlayIter Unknown",
          myQuote : "",
          settings : {
            djName: 'Dj Unknown',
            skipValue: 5,
            anthem : ""
          }
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
  loadPlaylist(playlistName : string){
    this.playlistCollection.doc(playlistName).get()
      .then(playlistData => {
        let songs : SongObject = playlistData.get('songs');
        this.events.publish('player:queList', [songs , playlistName]);
        this.menu.close();
      })
  }
  setupCommandListener(){
    this.checkPendingCommands();

  }
  checkPendingCommands(){
    let pendingCommands : command[] = [];
    this.commandCollection.doc('desktop').get()
      .then(fields => {
        pendingCommands = fields.get('pending');
      });
    this.executeCommands(pendingCommands);
  }
  executeCommands(cmds : command[]){
    if(cmds.length > 0){
      let cmd = new command();
      cmds.forEach(c => {
        if(c.timeStamp > cmd.timeStamp)
          cmd = c;
      });
      this.executeCommand(cmd)
        .then(res => {
          cmds.splice(cmds.indexOf(cmd),1);
          this.executeCommands(cmds);
        })
    }
  }
  executeCommand(cmd : command) : Promise<boolean>{
    return new Promise((resolve => {
      if(!cmd.executed){
        switch (cmd.code){
          //browser handler
          case 'browser:play':
            break;
          case 'browser:stop':
            break;
          case 'browser:next':
            break;
          case 'browser:prev':
            break;
          case 'browser:skip:forward':
            break;
          case 'browser:skip:back':
            break;
          case 'browser:play:video':
            break;
          //mobile handler
          case 'mobile:play':
            break;
          case 'mobile:stop':
            break;
          case 'mobile:next':
            break;
          case 'mobile:prev':
            break;
          case 'mobile:skip:forward':
            break;
          case 'mobile:skip:back':
            break;
          case 'mobile:play:video':
            break;
        }
        resolve(true);
      }
      else{
        resolve(false);
      }

    }));
  }
}

