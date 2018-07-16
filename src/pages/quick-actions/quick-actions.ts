import { Component } from '@angular/core';
import {Platform, ViewController} from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import { HomePage } from "../home/home";
import * as firebase from "firebase";
import {SettingsPage} from "../settings/settings";
import { App } from "ionic-angular";

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
              private viewCtrl: ViewController,
              private plt : Platform,
              private app : App) {
    this.plt.registerBackButtonAction(() =>{
      const overlayView = this.app._appRoot._overlayPortal._views[0];
      if (overlayView && overlayView.dismiss) {
        overlayView.dismiss();
      } else {
        this.app.goBack();
      }
    }, 0);
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
    this.navCtrl.push(SettingsPage);
  }

}
