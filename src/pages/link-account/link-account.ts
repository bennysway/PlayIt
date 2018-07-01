import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilProvider } from "../../providers/util/util";
import * as firebase from "firebase";
import {PlayerPage} from "../player/player";
import AuthProvider = firebase.auth.AuthProvider;

/**
 * Generated class for the LinkAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-link-account',
  templateUrl: 'link-account.html',
})
export class LinkAccountPage {

  link_to_name : string = "Provider";
  link_to: string = "";
  link_from : string = "Provider";
  isEmailNeeded : boolean = false;
  credential: any;
  provider : AuthProvider;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilProvider) {
    this.util.store.get('link-from').then(data =>{
      this.link_from = data;
    });
    this.util.store.get('link-to').then(data =>{
      this.link_to = data;
      switch (data){
        case "Google":
          this.provider = new firebase.auth.GoogleAuthProvider();
          break;
        case "Facebook":
          this.provider = new firebase.auth.FacebookAuthProvider();
          break;
        case "Twitter":
          this.provider = new firebase.auth.TwitterAuthProvider();
          break;
        case "GitHub":
          this.provider = new firebase.auth.GithubAuthProvider();
          break;
        case "Email":
          this.isEmailNeeded = true;
          let eml,pwd;
          this.util.store.get('eml').then(result => {eml = result;});
          this.util.store.get('pwd').then(result => {pwd = result;});
          this.credential = firebase.auth.EmailAuthProvider.credential(eml,pwd);
          break;
      }
    }).then(() => {
      this.linkAutomatically();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinkAccountPage');
  }

  link(){
    if(this.isEmailNeeded){
      firebase.auth().currentUser.linkAndRetrieveDataWithCredential(this.credential).then(() =>{
        this.signinSuccess();
      })
    } else {
      firebase.auth().currentUser.linkWithPopup(this.provider).then(result => {
        this.signinSuccess();
      }).catch(error => {
        this.util.showToast("Link failed. Lets try again 😭");
        console.log(error.message);
        console.log(error.code);
        this.navCtrl.pop();
      });
    }

  }
  linkAutomatically(){
    firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.signinSuccess();
          }
        });
      }
    }).catch(error =>{
      this.util.showToast("Link failed. Lets try again 😭");
      console.log(error.message);
      console.log(error.code);
      this.navCtrl.pop();
    });
  }
  cancel(){
    this.navCtrl.pop();
  }

  signinSuccess(){
    this.util.showToast("Successful Link and Sign in 😊");
    this.util.store.remove('link');
    this.util.store.remove('link-to');
    this.util.store.remove('link-from');
    this.util.store.remove('eml');
    this.util.store.remove('pwd');
    this.navCtrl.setRoot(PlayerPage);
  }

}
