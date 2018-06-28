import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaltyProvider } from "../../providers/salty/salty";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import { User} from "../../app/models/user-model";
@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  users: User[] = [];
  spice_result:string = "";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private salt: SaltyProvider,
              public db: AngularFireDatabase) {;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  makeSalt(item:string){
    let token: string = this.salt.salter(item);
    let coin: string = this.salt.spicer(token,"me");
    this.users.push(new User(token,coin));
  }

}
