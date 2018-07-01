import { Component } from '@angular/core';
import { ViewController } from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import { HomePage } from "../home/home";
import * as firebase from "firebase";

/**
 * Generated class for the QuickActionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quick-actions',
  templateUrl: 'quick-actions.html',
})
export class QuickActionsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilProvider,
              private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuickActionsPage');
  }

  logout(){
    firebase.auth().signOut().then(() => {
    }).then(() => {
      this.util.showToast("Goodbye 😊");
      this.navCtrl.pop();
      this.navCtrl.setRoot(HomePage);
    })
      .catch( error => {
        this.util.showToast("Oops! Could not log out. Check your connection 😊");
        console.log(error.message);
        console.log(error.code);
      });
  }

  openSettings(){
    this.util.showToast("Under construction.");
  }

}
