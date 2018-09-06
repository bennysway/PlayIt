import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { youtubeConfig } from "../../app/api-keys";
import {VideoObject,VideoExtendedInfo} from "../../app/models/video-model";
import {UtilProvider} from "../util/util";
import moment from 'moment';

@Injectable()
export class VideoProvider {
  private baseUrl : string = "https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet%2C+contentDetails%2C+statistics&key=" + youtubeConfig.api + "&id=";
  private searchUrl: string = "https://www.googleapis.com/youtube/v3/search/?part=id%2C+snippet&videoCategoryId=10&maxResults=20&type=video&key=" + youtubeConfig.api + "&q=";

  constructor(private http: HttpClient,
              private util: UtilProvider) {
  }

  static getPurity(upVotes:string, downVotes:string):number{
    let up = parseInt(upVotes);
    let down = parseInt(downVotes);
    let total = up + down;
    if(total>0)
      return Math.round(up/total*100);
    else return 0;
  }
  getVideoFromYoutube(videoId : string){
    return new Promise<VideoObject>((resolve,reject) =>{
      this.getVideoDataFromHttp(videoId)
        .then(data => {
          let items = data.items;
          items.forEach(i =>{
            let urlVideo = new VideoObject();
            urlVideo.title = i.snippet.title;
            urlVideo.date = i.snippet.publishedAt;
            urlVideo.channel_name = i.snippet.channelTitle;
            urlVideo.id = i.id;
            urlVideo.description = i.snippet.description.substr(0,160) + '... ';
            urlVideo.thumbnail = i.snippet.thumbnails.default.url;
            this.util.store.set(videoId,urlVideo);
            resolve(urlVideo);
          });
          this.getExtendedInfo(videoId);
          if(items.length<=0) reject("");
        });
    });
  }
  getVideoFromStorage(videoId : string){
    return this.util.store.get(videoId);
  }
  searchVideosFromYoutube(keywords):Promise<VideoObject[]>{
    return new Promise<VideoObject[]>((resolve) =>{
      let videos : Array<VideoObject> =[];
      this.util.store.get('search:' + keywords)
        .then(data =>{
          if(data){
            resolve(data);
          }
          else {
            this.searchVideosFromHttp(keywords)
              .then(data => {
                let items = data.items;
                items.forEach(i => {
                  let urlVideo = new VideoObject();
                  urlVideo.title = i.snippet.title;
                  urlVideo.date = i.snippet.publishedAt;
                  urlVideo.channel_name = i.snippet.channelTitle;
                  urlVideo.id = i.id.videoId;
                  urlVideo.description = i.snippet.description;
                  urlVideo.thumbnail = i.snippet.thumbnails.default.url;
                  this.util.store.set(i.id.videoId,urlVideo);
                  videos.push(urlVideo);
                });
              }).then(() => {
                this.util.store.set('search:' + keywords, videos);
                resolve(videos);
              })
              .catch(error =>{
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
  private getVideoDataFromHttp(videoId : string):Promise<any>{
    let url = this.baseUrl + videoId;
    console.log(url);
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
  getExtendedInfo(videoId : string) : Promise<VideoExtendedInfo>{
    let urlVideo = new VideoExtendedInfo();
    return new Promise<VideoExtendedInfo>((resolve) => {
      this.getVideoFromStorage(videoId + 'ExtendedInfo')
        .then(data =>{
          if(data)
            urlVideo = data;
          else {
            this.getVideoDataFromHttp(videoId)
              .then(data =>{
                let items = data.items;
                items.forEach(i => {
                  try{
                    urlVideo.description = i.snippet.description;
                    urlVideo.upVotes = i.statistics.likeCount;
                    urlVideo.downVotes = i.statistics.dislikeCount;
                    urlVideo.purity = VideoProvider.getPurity(urlVideo.upVotes,urlVideo.downVotes);
                    urlVideo.duration = (moment.duration(i.contentDetails.duration, moment.ISO_8601.__momentBuiltinFormatBrand)).asSeconds();
                    if(i.snippet.tags){
                      i.snippet.tags.forEach(tag => {
                        urlVideo.tags.push(tag);
                      });
                    }
                    if(i.snippet.thumbnails.maxres){
                      urlVideo.background = i.snippet.thumbnails.maxres.url;
                    }
                    this.util.store.set(videoId + 'ExtendedInfo', urlVideo);
                    resolve(urlVideo);
                  }catch(e) {
                    console.log(e)
                  }
                });
              });
          }
        }).then(() =>{ resolve(urlVideo)});
    });
  }

}
