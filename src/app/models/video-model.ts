export class VideoObject{
  title: string;
  date: string;
  channel_name : string;
  id: string;
  tags: string[];
  thumbnail: string;
  background: string;
  constructor(){
    this.title = "Title";
    this.date = "2010-01-01T12:00:00.000Z";
    this.channel_name = "Channel";
    this.tags = [];
    this.thumbnail = "";
    this.background = "";
  }
}
