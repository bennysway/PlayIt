import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { PopoverController} from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickActionsPage } from "../quick-actions/quick-actions";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UtilProvider} from "../../providers/util/util";
import {VideoProvider} from "../../providers/video/video";
import { VideoObject } from "../../app/models/video-model";

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  @ViewChild('ytPlayer') ytPlayer;
  trustedVideoUrl: SafeResourceUrl;
  videoId : string = '6KVjo36lrSw';
  video: any = {
    link: 'https://www.youtube.com/embed/'+this.videoId+'?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist='+this.videoId ,
    title: 'Awesome video'
  };
  videos: VideoObject[] = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popOver: PopoverController,
              public util:UtilProvider,
              private domSanitizer: DomSanitizer,
              private vp: VideoProvider,
              private cd : ChangeDetectorRef) {

  }
  ionViewDidLoad() {
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.link);
  }
  initVideo(){
    this.video.link = 'https://www.youtube.com/embed/'+this.videoId+'?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist='+this.videoId;
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.link);
  }
  showPopOver(myEvent){
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
          .then(data =>{ this.videos = data;})
          .then(() => { this.cd.detectChanges();})
          .catch(() => { console.log("Could not search videos");});
      });
  }
  play(id:string){
    this.videoId = id;
    this.initVideo();
    this.ytPlayer.nativeElement.src = this.trustedVideoUrl;
    this.videos = [];
    this.cd.detectChanges();
    this.util.showLoader("Loading...");
  }
  addToPlayList(id:string){

  }

}
