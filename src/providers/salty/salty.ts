import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the SaltyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SaltyProvider {

  constructor(public http: HttpClient) {
  }

  alphaNum(letter: string): number{
    //83 elements
   let store = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9",".","@","!","#","$","%","&","'","*","+","-","/","=","?","^","_","`","{","|","}","~"];
   if(letter.length == 1) return store.indexOf(letter);
   else return store.indexOf(letter[0]);
  }
  numAlpha(value: number): string{
    let store = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9",".","@","!","#","$","%","&","'","*","+","-","/","=","?","^","_","`","{","|","}","~"];
    if(value > 83) return store[value % 83];
    else return store[value];
  }
  salter(token : string): string{
    let salted = "";
    let magic = token.length;
    for (let i = 0; i < token.length; i++)
      salted += this.numAlpha(this.alphaNum(token.charAt(i)) + magic * 7);
    return salted;
  }
  spicer(token: string, provider: string) : string {
    let salted = this.salter(token);
    salted = provider + salted;
    return this.salter(salted);
  }

}
