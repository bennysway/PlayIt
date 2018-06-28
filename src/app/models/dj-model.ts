export class Dj{
  songs: string[] = [];
  currentTrack: number;

  constructor(public token: string){

  }
  getSong(track: number): string{
    if((track) < this.songs.length)
      return this.songs[this.currentTrack];
    else if(this.songs.length > 0)
      return this.songs[0];
    else return "";
  }

  addSong(song: string){
    this.songs.push(song);
  }
  removeSong(song: string){
    for(let i:number =0; i<this.songs.length; i++){
      if(this.songs[i] == song){
        this.songs.splice(i,1);
      }
    }
  }
  repositionSong(song: string, position: number){
    this.removeSong(song);
    this.songs.splice(position,0,song);
  }
  setCurrentPlayingSong(track: number){
    this.currentTrack = track;
  }
}
