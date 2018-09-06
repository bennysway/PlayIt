import {Component} from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { VideoProvider } from "../../providers/video/video";
import {YoutubeProvider} from "../../providers/youtube/youtube";
import {SettingsPage} from "../settings/settings";

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
  providers:[YoutubeProvider]
})
export class TestPage {

  constructor(public navCtrl: NavController,
              public ytPlayer : YoutubeProvider) {

  }

  ionViewWillEnter(){
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.ytPlayer.setupPlayer();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  getInfo(id: string) {
    this.ytPlayer.launchPlayer(id);
  }

  push(){
    this.navCtrl.push(SettingsPage);
  }
}
