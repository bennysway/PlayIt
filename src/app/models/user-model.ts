export class User {
  coins: string[] = [];
  name: string = "";

  constructor(public token: string, public coin: string){
    this.coins.push(coin);
  }

  removeCoin(coin: string){
    for(let i:number  = 0; i < this.coins.length; i++) {
      if(this.coins[i] == coin){
        this.coins.splice(i, 1);
      }
    }
  }
  addCoin(coin: string){
    this.coins.push(coin);
  }
  changeUserName(username: string){
    this.name = username;
  }

}
