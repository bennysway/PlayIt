export class SongObject {
  id : string;
  title : string;
  constructor(songTitle : string, songId : string){
    this.title = songTitle;
    this.id = songId;
  }
}
