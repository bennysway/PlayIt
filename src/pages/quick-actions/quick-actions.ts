import { Component } from '@angular/core';
import {Platform} from "ionic-angular";
import { IonicPage, NavController } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import { HomePage } from "../home/home";
import * as firebase from "firebase";
import {SettingsPage} from "../settings/settings";
import { App } from "ionic-angular";
import {AboutPage} from "../about/about";

@IonicPage()
@Component({
  selector: 'page-quick-actions',
  templateUrl: 'quick-actions.html',
})
export class QuickActionsPage {

  constructor(public navCtrl: NavController,
              private util: UtilProvider,
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
  about(){
    this.navCtrl.push(AboutPage);
  }

}
