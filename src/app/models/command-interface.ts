
export class command{
  code : string;
  timeStamp : number;
  executed : boolean;
  uid : string;
  videoId : string;
  target : string;
  from : number;
  to : number;
  constructor(){
    this.code = "";
    this.timeStamp = 0;
    this.executed = false;
    this.uid = "";
    this.videoId = "";
    this.target = "";
    this.from = 0;
    this.to = 0;
  }
}
