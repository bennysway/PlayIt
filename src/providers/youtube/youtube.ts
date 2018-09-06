import { Injectable } from '@angular/core';
import {Events} from "ionic-angular";

@Injectable()
export class YoutubeProvider {

  youtube: any = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '40%',
    playerWidth: '40%'
  };

  constructor(  private eventPublisher : Events) {
    this.setupPlayer();
  }

  bindPlayer(elementId): void {
    this.youtube.playerId = elementId;
  };

  createPlayer(): void {
    return new window['YT'].Player(this.youtube.playerId, {
      height: this.youtube.playerHeight,
      width: this.youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onStateChange' : (value) => this.eventPublisher.publish('youtube:onStateChange', value),
        'onError' : (value) => this.eventPublisher.publish('youtube:onError', value),
      }
    });
  }

  loadPlayer(): void {
    if (this.youtube.ready && this.youtube.playerId) {
      if (this.youtube.player) {
        console.log('removed the player');
        this.youtube.player.destroy();
      }
      this.youtube.player = this.createPlayer();
    }
  }

  setupPlayer() {
    //we need to check if the api is loaded
    window['onYouTubeIframeAPIReady'] = () => {
      if (window['YT']) {
        this.youtube.ready = true;
        this.bindPlayer('placeholder');
        this.loadPlayer();
      }
    };
    if (window['YT'] && window['YT'].Player) {
      this.youtube.ready = true;
      this.bindPlayer('placeholder');
      this.loadPlayer();
    }
  }

  launchPlayer(id): void {
    this.youtube.player.loadVideoById(id);
    this.youtube.videoId = id;
    return this.youtube;
  }
  play(){
    this.youtube.player.playVideo();
  }
  pause(){
    this.youtube.player.pauseVideo();
  }
  skipForward(seconds : number){
    this.youtube.player.seekTo(this.youtube.player.getCurrentTime() + seconds , true);
  }
  skipBackward(seconds : number){
    this.youtube.player.seekTo(this.youtube.player.getCurrentTime() - seconds , true);
  }
  next(){
    this.youtube.player.nextVideo();
  }
  previous(){
    this.youtube.player.previousVideo();
  }
  getSeconds() : number{
    return this.youtube.player.getCurrentTime();
  }
}


