import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class SaltyProvider {
  constructor(public http: HttpClient) {
  }
  alphaNum(letter: string): number{
    //83 elements
    let store = ["'","G","+","Z","y","8","-","|","f","A","z","H","$","?","g","q","I","`","C","c","T","i","D","j","U","l","K","p","%","a","k","W","F","e","7","O","X","E","4","{","o","m","2","#","3",".","b","u","/","5","S","!","^","1","~","N","P","}","@","M","s","0","V","v","R","Q","B","9","J","*","h","r","t","=","6","Y","n","_","w","x","&","d","L"];
   if(letter.length == 1) return store.indexOf(letter);
   else return store.indexOf(letter[0]);
  }
  numAlpha(value: number): string{
    let store = ["'","G","+","Z","y","8","-","|","f","A","z","H","$","?","g","q","I","`","C","c","T","i","D","j","U","l","K","p","%","a","k","W","F","e","7","O","X","E","4","{","o","m","2","#","3",".","b","u","/","5","S","!","^","1","~","N","P","}","@","M","s","0","V","v","R","Q","B","9","J","*","h","r","t","=","6","Y","n","_","w","x","&","d","L"];
    if(value >= 83) return store[value % 83];
    else return store[value];
  }
  salter(token : string): string{
    let salted = "";
    let magic = token.length;
    for (let i = 0; i < token.length; i++) {
      salted += this.numAlpha(this.alphaNum(token.charAt(i)) + magic * 7);
    }
    return salted;
  }
  spicer(token: string, provider: string) : string {
    let salted = this.salter(token);
    salted = provider + salted;
    return this.salter(salted);
  }

}
