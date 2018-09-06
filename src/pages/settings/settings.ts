import {Component, ViewChild} from '@angular/core';
import {IonicPage, Platform} from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import * as firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  profileRef: firebase.firestore.DocumentReference;

  @ViewChild('name') userName;
  @ViewChild('djname') djName;
  @ViewChild('quote') userQuote;
  skipValue : any;
  autoSignIn : boolean;
  isDeviceMobile : boolean;
  @ViewChild('anthem') anthem;

  constructor(public util : UtilProvider,
              public plt : Platform) {
    this.isDeviceMobile = this.plt.is('mobile');
  }

  ionViewDidLoad() {
    let db = firebase.firestore();
    let id = firebase.auth().currentUser.uid;
    this.profileRef = db.doc('users/' + id);
    this.profileRef.get()
      .then(data =>{
        this.userName.value = data.get('name');
        this.userQuote.value = data.get('myQuote');
        this.djName.value = data.get('settings.djName');
        this.skipValue = (data.get('settings.skipValue') - 5) / 115;
        this.anthem.value = data.get('settings.anthem');
      });
    this.util.store.get('autoSignIn').then(data =>{
      if(data != null)
        this.autoSignIn = true;
      else
        this.autoSignIn = false;
    });
  }

  ionViewWillLeave(){
    let db = firebase.firestore();
    let id = firebase.auth().currentUser.uid;
    let tempName = this.userName.value,
      tempDjName = this.djName.value,
      tempQuote = this.userQuote.value,
      tempSkip = this.skipValue,
      tempAnthem = this.anthem.value;

    if(tempDjName=="")
      tempDjName = "Dj Unknown";
    tempSkip = (tempSkip*115) + 5;

    this.profileRef = db.doc('users/' + id);
    this.profileRef.set({
      name : tempName,
      myQuote : tempQuote,
      settings : {
        djName: tempDjName,
        skipValue: tempSkip,
        anthem : tempAnthem
      }
    }, { merge: true });
    if(!this.autoSignIn){
      this.util.store.remove('autoSignIn');
    }
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
