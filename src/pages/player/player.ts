import {ChangeDetectorRef, Component} from '@angular/core';
import {Events, PopoverController} from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickActionsPage } from "../quick-actions/quick-actions";
import {UtilProvider} from "../../providers/util/util";
import {VideoProvider} from "../../providers/video/video";
import {VideoExtendedInfo, VideoObject} from "../../app/models/video-model";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/interval";
import {YoutubeProvider} from "../../providers/youtube/youtube";
import {SongObject} from "../../app/models/song-model";
@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
  providers: [YoutubeProvider]
})
export class PlayerPage {

  videoId : string = 'ccRjkYvaHn8';
  searchedVideos: VideoObject[] = [];
  showDetails : boolean = true;
  showSearchList : boolean = false;
  showPlaylist : boolean = false;

  //
  playing : boolean = false;
  truncating = true;
  info: VideoObject = new VideoObject();
  extended: VideoExtendedInfo = new VideoExtendedInfo();
  showPurity : boolean;
  tagPager : any;
  tagsPosition: number;

  // Playlist
  playlist : Array<SongObject> = [];
  tempPlaylist : Array<SongObject> = [];
  currentTrackIndex : number = -1;
  repeatMode : number = 0;
  playlistName : string = "";

  //manage playlist
  managePlaylist : boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popOver: PopoverController,
              public util:UtilProvider,
              private vp: VideoProvider,
              private cd : ChangeDetectorRef,
              private ytPlayer : YoutubeProvider,
              private events : Events) {
    events.subscribe('youtube:onReady');
    events.subscribe('youtube:onStateChange', (e) => this.playerStateChanged(e.data) );
    events.subscribe('youtube:onError', (e) => this.playerError(e.data) );
    events.subscribe('player:queList',  ([playlist,playlistName]) => this.setPlaylist(playlist,playlistName));
    events.subscribe('player:playIndex', (e) => this.playFromList(e));
  }
  ionViewDidLoad() {
  }

  ionViewWillEnter(){
    this.truncating = true;
    this.showPurity = false;
    this.tagsPosition = 0;
    this.tagPager = Observable.interval(5000);
    this.getInfo(this.videoId);
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.ytPlayer.setupPlayer();
  }

  showOptions(myEvent){
    let pop = this.popOver.create(QuickActionsPage);
    pop.present({
      ev : myEvent
    });
  }
  search(){
    this.util.showPrompt('Search',
      'Search for a music video',
      'In My Feelings',
      'Search',
      'Cancel')
      .then(data =>{
        this.vp.searchVideosFromYoutube(data)
          .then(data =>{
            this.searchedVideos = data;
            this.playlist = [];
            this.playlistName = 'Search Results';
            for(let video of this.searchedVideos){
              this.playlist.push(new SongObject(video.title,video.id));
            }
          })
          .then(() => { this.togglePanel('search',true)} )
          .catch((error) => {
            console.log("Could not search searchedVideos");
            console.log(error);
          });
      });
  }
  play(id:string){
    this.getInfo(id);
    this.videoId = id;
    this.ytPlayer.launchPlayer(id);
    this.togglePanel('detail',true);
    this.truncating = true;
  }
  addToPlayList(id:string,title:string){
    this.events.publish('addToPlaylist', id,title);
  }
  togglePanel(panel : string, persistance : boolean){
    switch(panel){
      case 'details':
        this.showDetails = true;
        this.showPlaylist = false;
        this.showSearchList = false;
        break;
      case 'search':
        if(persistance){
          this.showDetails = false;
          this.showPlaylist = false;
          this.showSearchList = true;
        }
        else if(this.showSearchList){
          this.showDetails = true;
          this.showPlaylist = false;
          this.showSearchList = false;
        }
        else {
          this.showDetails = false;
          this.showPlaylist = false;
          this.showSearchList = true;
        }
        break;
      case 'playlist':
        if(persistance){
          this.showDetails = false;
          this.showPlaylist = true;
          this.showSearchList = false;
        }
        else if(this.showPlaylist){
          this.showDetails = true;
          this.showPlaylist = false;
          this.showSearchList = false;
        }
        else {
          this.showDetails = false;
          this.showPlaylist = true;
          this.showSearchList = false;
        }
        break;
    }
    this.cd.detectChanges();
  }
  toggleRepeat(){
    this.repeatMode = (this.repeatMode + 1) % 3;
    this.cd.detectChanges();
  }
  enableEditPlaylist(){
    this.managePlaylist = true;
    this.tempPlaylist = this.playlist;
    this.cd.detectChanges();
  }
  disableEditPlaylist(){
    this.managePlaylist = false;
    this.playlist = this.tempPlaylist;
    this.managePlaylist = false;
    this.cd.detectChanges();
  }
  updatePlaylist(){
    this.events.publish('playlist:update',[this.playlist, this.playlistName]);
  }
  moveSongUp(index : number){
    if(index > 0){
      let temp = this.playlist[index];
      this.playlist.splice(index,1);
      this.playlist.splice(index-1,0,temp);
      this.cd.detectChanges();
    }
  }
  moveSongDown(index : number){
    if(index < this.playlist.length - 1){
      let temp = this.playlist[index];
      this.playlist.splice(index,1);
      this.playlist.splice(index + 1, 0, temp);
      this.cd.detectChanges();
    }
  }
  deleteSong(index : number){
    this.playlist.splice(index,1);
    this.cd.detectChanges();
  }
  test(){
  }
  getInfo(id: string) {
    this.vp.getVideoFromStorage(id)
      .then(data => {
        if(data){
          console.log("Storage:");
          this.info = data;
          this.vp.getExtendedInfo(id)
            .then(data => {
              this.extended = data;
              this.cd.detectChanges();
            })
            .catch(error => {
              console.log(error);
            });
        }
        else{
          this.vp.getVideoFromYoutube(id).then(data => {
            if(data){
              console.log("APi:");
              this.info = data;
              this.cd.detectChanges();
            }
          })
            .then(() =>{
              this.vp.getExtendedInfo(id)
                .then(data => {
                  this.extended = data;
                  this.cd.detectChanges();
                });
            })
            .catch(() => {
              console.log("not found");
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
    this.util.store.set('lastPlayed',id);
  }
  showMoreInfo(){
    this.truncating = !this.truncating;
    if(this.truncating){
      this.tagPager.unsubscribe();
    } else {
      this.tagPager = Observable.interval(5000)
        .subscribe(() =>{this.changeTag();});
    }
    this.cd.detectChanges();
  }
  changeTag(){
    if(this.extended){
      if(this.tagsPosition < this.extended.tags.length){
        this.tagsPosition++;
        this.cd.detectChanges();
      } else {
        this.tagsPosition = 0;
      }
    }
  }
  togglePurity(){
    this.showPurity = !this.showPurity;
  }

  //Youtube Handlers
  playerStateChanged(state){
    switch (state){
      case -1: // – unstarted
        this.playing = false;
        break;
      case 0: // – ended
        this.playing = false;
        this.playNextSong();
        break;
      case 1: // – playing
        this.playing = true;
        break;
      case 2: // – paused
        this.playing = false;
        break;
      case 3: // – buffering
        this.playing = false;
        break;
      case 5: // – video cued
        this.playing = false;
        break;
      default:
        console.log(state);
    }
    this.cd.detectChanges();
  }
  playerError(error){
    switch(error){
      case 2:
        this.util.showToast("Invalid video.");
        break;
      case 5:
        this.util.showToast("Cannot play video right now");
        break;
      case 100:
        this.util.showToast("Cannot find video.");
        break;
      case 101:
      case 150:
        this.util.showSelectList('Copyright Video',
          ['Play with PlayIt Desktop', 'Play with Youtube'])
          .then(data =>{
            if(data=='Play with PlayIt Desktop'){

            }else if(data == 'Play with Youtube'){

            }
          });
        break;
      default:
        this.util.showToast("There is a unknown problem playing this video");
        console.log(error);
        break;
    }
    this.cd.detectChanges();
  }
  playBtn(){
    if(this.playing)
      this.ytPlayer.pause();
    else
      this.ytPlayer.play();
  }
  nextBtn(){
    this.playNextSong();
  }
  prevBtn(){
    this.playPreviousSong();
  }
  skipBackBtn(){
    this.util.store.get('skipValue')
      .then(value => {
        if(value){
          this.ytPlayer.skipBackward(value);
        }
        else{
          //set default skip value to 5 seconds
          this.ytPlayer.skipBackward(5);
          this.util.store.set('skipValue', 5);
        }
      });
  }
  skipForwardBtn(){
    this.util.store.get('skipValue')
      .then(value => {
        if(value){
          this.ytPlayer.skipForward(value);
        }
        else{
          //set default skip value to 5 seconds
          this.ytPlayer.skipForward(5);
          this.util.store.set('skipValue', 5);
        }
      });
  }
  playNextSong(){
    this.currentTrackIndex++;
    switch (this.repeatMode) {
      case 0:
        if(this.currentTrackIndex < this.playlist.length)
          this.playFromList(this.currentTrackIndex);
        break;
      case 1:
        this.currentTrackIndex--;
        this.playFromList(this.currentTrackIndex);
        break;
      case 2:
        if(this.currentTrackIndex >= this.playlist.length)
          this.currentTrackIndex = 0;
        this.playFromList(this.currentTrackIndex);
        break;
    }
  }
  playPreviousSong(){
    this.currentTrackIndex--;
    if(this.ytPlayer.getSeconds() < 3){
      console.log(this.ytPlayer.getSeconds());
      this.currentTrackIndex++;
      this.playFromList(this.currentTrackIndex);
    }
    else if(this.currentTrackIndex > 0){
      this.playFromList(this.currentTrackIndex);
    }
    else{
      this.currentTrackIndex++;
      this.playFromList(this.currentTrackIndex);
    }
  }

  //App Handlers
  setPlaylist(list : Array<SongObject>, playlistName : string){
    this.playlist = list;
    this.playlistName = playlistName;
    this.searchedVideos = [];
    this.togglePanel('playlist',true);
    this.cd.detectChanges();
  }
  playFromList(index : number){
    if(!this.managePlaylist){
      console.log("Song index " + (index + 1) + "/" + this.playlist.length + " called.");
      this.currentTrackIndex = index;
      this.play(this.playlist[index].id);
    }
  }


}
