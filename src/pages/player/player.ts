import {Component, ViewChild} from '@angular/core';
import {LoadingController, PopoverController} from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickActionsPage } from "../quick-actions/quick-actions";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  @ViewChild('ytPlayer') ytPlayer;
  trustedVideoUrl: SafeResourceUrl;
  videoId : string = 'OCmCLfLPxzM';
  video: any = {
    link: 'https://www.youtube.com/embed/'+this.videoId+'?&autoplay=1&loop=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist='+this.videoId ,
    title: 'Awesome video'
  };



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popOver: PopoverController,
              public loadingCtrl:LoadingController,
              private domSanitizer: DomSanitizer) {
  }
  ionViewDidLoad() {
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.link);
  }
  showPopOver(myEvent){
    let pop = this.popOver.create(QuickActionsPage);
    pop.present({
      ev : myEvent
    })
  }
  stop(){
    this.ytPlayer.stop();
  }

}
