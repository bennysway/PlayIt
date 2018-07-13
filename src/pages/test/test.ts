import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from "angularfire2/database";
import { VideoObject } from "../../app/models/video-model";
import { VideoProvider } from "../../providers/video/video";

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  videos: VideoObject[] = [];

  constructor(public navCtrl: NavController,
              public db: AngularFireDatabase,
              private vp: VideoProvider) {
    ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  getInfo(id: string) {
    this.vp.getVideoFromStorage(id)
      .then(data => {
        if(data){
          this.videos.push(data);
        }
        else{
          this.vp.getVideoFromYoutube(id).then(data => {
            if(data)
              this.videos.push(data);
          })
            .catch(() => {
              console.log("not found");
            })
        }
      })
  }
}
