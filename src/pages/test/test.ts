import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SaltyProvider } from "../../providers/salty/salty";
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";


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

  salt_result: string = "";
  spice_result:string = "";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private salt: SaltyProvider,
              public db: AngularFireDatabase) {;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

  makeSalt(){
    this.salt_result = "yass";
    this.spice_result = "but chill...";
  }

}
