import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { youtubeConfig } from "../../app/api-keys";
import {VideoObject} from "../../app/models/video-model";
import {UtilProvider} from "../util/util";

@Injectable()
export class VideoProvider {
  private baseUrl : string = "https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&key=" + youtubeConfig.api + "&id=";
  private searchUrl: string = "https://www.googleapis.com/youtube/v3/search/?part=snippet&maxResults=25&type=video&key=" + youtubeConfig.api + "&q=";

  constructor(private http: HttpClient,
              private util: UtilProvider) {

    //this.title = data.items[0].snippet.title;
    //this.date = data.items[0].snippet.publishedAt;
    //this.channel_name = data.items[0].snippet.channelTitle;
  }

  getVideoFromYoutube(videoId : string){
    return new Promise<VideoObject>((resolve,reject) =>{
      this.getVideoDataFromHttp(videoId)
        .then(data => {
          let items = data.items;
          items.forEach(i =>{
            //console.log("...getting video id:" + videoId + " from api.");
            let urlVideo = new VideoObject();
            urlVideo.title = i.snippet.title;
            urlVideo.date = i.snippet.publishedAt;
            urlVideo.channel_name = i.snippet.channelTitle;
            urlVideo.id = i.id.videoId;
            urlVideo.thumbnail = i.snippet.thumbnails.default.url;
            if(i.snippet.tags){
              i.snippet.tags.forEach(tag => {
                urlVideo.tags.push(tag);
              });
            }
            if(i.snippet.thumbnails.maxres){
              console.log(i.snippet.thumbnails.maxres);
              //urlVideo.background = i.snippet.thumbnails.maxres.url;
            }
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
  searchVideosFromYoutube(keywords):Promise<VideoObject[]>{
    return new Promise<VideoObject[]>((resolve,reject) =>{
      let videos : Array<VideoObject> =[];
      this.searchVideosFromHttp(keywords)
        .then(data => {
          let items = data.items;
          items.forEach(i => {
            let urlVideo = new VideoObject();
            urlVideo.title = i.snippet.title;
            urlVideo.date = i.snippet.publishedAt;
            urlVideo.channel_name = i.snippet.channelTitle;
            urlVideo.id = i.id.videoId;
            urlVideo.thumbnail = i.snippet.thumbnails.default.url;
            if(i.snippet.tags){
              i.snippet.tags.forEach(tag => {
                urlVideo.tags.push(tag);
              });
            }
            if(i.snippet.thumbnails.maxres){
              console.log(i.snippet.thumbnails.maxres);
              //urlVideo.background = i.snippet.thumbnails.maxres.url;
            }
            this.util.store.set(i.id.videoId,urlVideo);
            videos.push(urlVideo);
          });
        }).then(() => {resolve(videos);});
    })
  }
  private getVideoDataFromHttp(videoId : string):Promise<any>{
    let url = this.baseUrl + videoId;
    return new Promise(resolve => {
      this.http.get(url).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  private searchVideosFromHttp(keyword : string):Promise<any>{
    let url = this.searchUrl + keyword;
    return new Promise<any>(resolve => {
      this.http.get(url).subscribe(data =>{
        resolve(data);
      }, error2 => {
        console.log(error2);
      })

    })
  }

}
