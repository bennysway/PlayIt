export class Caster{
  constructor(public location: string,
              public currentSong: string,
              public token: string){

  }
  changeSong(song: string){
    this.currentSong = song;
  }
}
