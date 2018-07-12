import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { youtubeConfig } from "../../app/api-keys";
import {VideoObject} from "../../app/models/video-model";
import {UtilProvider} from "../util/util";

@Injectable()
export class VideoProvider {
  private baseUrl : string = "https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&key=" + youtubeConfig.api + "&id=";


  constructor(private http: HttpClient,
              private util: UtilProvider) {

    //this.title = data.items[0].snippet.title;
    //this.date = data.items[0].snippet.publishedAt;
    //this.channel_name = data.items[0].snippet.channelTitle;
  }

  getVideoFromYoutube(videoId : string){
    return new Promise((resolve,reject) =>{
      this.getVideoDataFromHttp(videoId)
        .then(data => {
          let items = data.items;
          items.forEach(i =>{
            //console.log("...getting video id:" + videoId + " from api.");
            let urlVideo = new VideoObject();
            urlVideo.title = i.snippet.title;
            urlVideo.date = i.snippet.publishedAt;
            urlVideo.channel_name = i.snippet.channelTitle;
            this.util.store.set(videoId,urlVideo);
            resolve(urlVideo);
          });
          if(items.length<=0) reject("");
        });
    });
  }



  getVideoFromStorage(videoId : string){
    return this.util.store.get(videoId);
  }

  getVideoDataFromHttp(videoId : string){
    let url = this.baseUrl + videoId;
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}
