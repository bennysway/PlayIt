export class VideoObject{
  title: string;
  date: string;
  channel_name : string;
  id: string;
  thumbnail: string;
  description : string;
  constructor(){
    this.title = "Janie Jr App:";
    this.date = "2018-08-08T08:08:08.000Z";
    this.channel_name = "PlayIt";
    this.thumbnail = "https://pbs.twimg.com/profile_images/622063838863560704/IGdnYXub_400x400.png";
    this.id = "";
    this.description = "Welcome to PlayIt\n" +
      "Available on Google Play and as a WebApp\n" +
      "Stream all music";
  }
}
export class VideoExtendedInfo{
  description: string;
  tags: string[];
  upVotes: string;
  downVotes: string;
  duration: number;
  purity: number;
  background: string;
  constructor(){
    this.description = "";
    this.tags = [];
    this.background = "../../assets/imgs/appBg.jpg";
    this.upVotes = "0";
    this.downVotes = "0";
    this.duration = 0;
    this.purity = 0;
  }
}
