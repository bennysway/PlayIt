import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  @ViewChild('name') eml;
  @ViewChild('djname') pwd;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public util : UtilProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  clearCache(){
    this.util.showAlert(
      "Clear Cache",
      'Are you sure you want to clear cache? This does not remove any saved data.',
      'Sure',
      'Cancel'
    ).then(did_accept => {
      if(did_accept){
        this.util.store.clear()
          .then(() =>{
            this.util.showToast('Cache Cleared');
          })
          .catch(() =>{
            this.util.showToast('Unable to clear, try uninstalling and installing again.')
          });
      }
    });
  }

}
