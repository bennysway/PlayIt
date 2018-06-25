import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaltyProvider } from "../../providers/salty/salty";


/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  salt_result: string = "saltless";
  spice_result: string = "spiceless";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private salt: SaltyProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  makeSalt(token: string, num: number){
    console.log(token,num);
    this.salt_result = this.salt.salter(token);
    this.spice_result = this.salt.salter(this.salt_result);
  }

}
