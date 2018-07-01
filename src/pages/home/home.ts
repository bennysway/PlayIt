import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerPage} from "../player/player";
import { Platform } from 'ionic-angular';
import * as firebase from "firebase";
//Providers
import { GooglePlus } from "@ionic-native/google-plus";
import { UtilProvider } from "../../providers/util/util";
import { googlePlusConfig } from "../../app/api-keys";
import AuthCredential = firebase.auth.AuthCredential;
import {LinkAccountPage} from "../link-account/link-account";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('email') eml;
  @ViewChild('password') pwd;
  isLoggedIn: boolean = false;
  credential: AuthCredential;
  users: any;
  link:boolean = false;
  link_to = "";
  device_name: string = "none";
  device_icon: string = "none";
  constructor(public navCtrl: NavController ,
              public alertCtrl: AlertController,
              private fire: AngularFireAuth,
              private plt: Platform,
              private util: UtilProvider,
              private googlePlus : GooglePlus) {
    this.checkDevice();
    this.util.store.get('link').then(result => {
      this.link = result;
      this.util.store.get('link-to').then(data =>{ this.link_to = data;});
    }).then(() => {
      this.signInAutomatically();

    }).catch(() => {
      this.signInAutomatically();
    })
  }

  signIn(){
    this.util.showToast("Signing in with email ... ");
    this.util.store.set('link-from',"Email");
    if(this.eml.value != "" && this.pwd.value != ""){
      this.fire.auth.signInWithEmailAndPassword(this.eml.value, this.pwd.value)
        .then(data =>{
          this.util.store.set('eml', this.eml.value);
          this.util.store.set('pwd', this.pwd.value);
          this.signInSuccess();
        })
        .catch(error =>{
          console.log(error.code);
          this.signInFail(error.code);
        });
    } else {
      this.util.showToast("One or more of the credentials are empty");
    }

  }
  signInWithProvider(method: string){
    let provider;
    this.util.showToast("Signing in with " + method + " ... ");
    this.util.store.set('link-from',method);
    switch (method){
      case "Facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case "Google":
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      case "Twitter":
        provider = new firebase.auth.TwitterAuthProvider();
        break;
      case "GitHub":
        provider = new firebase.auth.GithubAuthProvider();
        break;
      default:
        provider = new firebase.auth.GoogleAuthProvider();
    }
    if(this.plt.is('cordova')){
      switch(method){
        case "Google":
          this.googleSignIn().then(() => this.signInSuccess()).catch(error => this.signInFail(error.message));
          break;
        default:
          firebase.auth().signInWithPopup(provider)
            .then(() =>{
              this.util.showToast("Signed in :)");
              console.log("Signed in with " + method);
              this.signInSuccess();
            })
            .catch(error => {
              this.util.showToast("Could not sign in with " + method);
              console.log(error.message);
              console.log(error.code);
              this.signInFail(error.code);
            });
          break;
      }
    }
    else{
      firebase.auth().signInWithRedirect(provider).then(function() {
        return firebase.auth().getRedirectResult();
      }).then(data => {
        this.util.showToast("Signed in :)");
        console.log("Signed in with " + method)
        this.signInSuccess();
      }).catch(error =>{
        this.util.showToast("Could not sign in with " + method);
        console.log(error.message);
        console.log(error.code);
        this.signInFail(error.code);
      });
    }
  }
  signInAutomatically(){
    firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.util.showToast("Successful Sign In 😊");
            this.signInSuccess();
          }
        });
      }
    }).catch(error => {
      this.util.showToast("Could not sign in");
      console.log(error.message);
      console.log(error.code);
      this.signInFail(error.code);
    });
  }
  checkDevice(){
    if(this.plt.is("mobile")){
      if(this.plt.is("android")){
        this.device_name = "Android";
        this.device_icon = "logo-android";
      }
      if(this.plt.is("ios")){
        this.device_name = "iPhone";
        this.device_icon = "logo-apple";
      }
      if(this.plt.is("windows")){
        this.device_name = "Windows";
        this.device_icon = "logo-windows";
      }
    }
    if(this.plt.is("core")){
      this.device_name = "Browser";
      this.device_icon = "browsers";
    }
  }
  //Google
  async googleSignIn(): Promise<void>{
    try{
      const gPlusUser = await this.googlePlus.login({
        'webClientId' : googlePlusConfig.webClientId,
        'offline' : true,
        'scopes' : 'profile,email'
      });
      return await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken))
    }
    catch(error) {
      console.log(error);
    }
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  test(){
    this.link = false;
    this.util.store.set('link',false);
  }
  signInSuccess() {
    if(this.link){
      this.util.showToast("Ready to link...");
      this.util.store.remove('link');
      this.navCtrl.push(LinkAccountPage);
    }
    else{
      this.util.store.remove('link');
      this.util.store.remove('link-to');
      this.util.store.remove('link-from');
      this.util.store.remove('eml');
      this.util.store.remove('pwd');
      this.navCtrl.setRoot(PlayerPage);
    }
  }
  signInFail(code : string) {
    let message;
    switch (code){
      case 'auth/invalid-email':
        message = 'You have entered an invalid email address😞';
        this.util.showToast(message);
        break;
      case 'auth/user-not-found':
        message = 'Email does not exist. Please register or easily use the options below';
        this.util.showToast(message);
        break;
      case 'auth/wrong-password':
        message = 'You entered a wrong password😞';
        this.util.showToast(message);
        break;
      case 'auth/user-disabled':
        message = 'This account is blocked 😞. Please use another account or register';
        break;
      case 'auth/account-exists-with-different-credential':
        let title = "Existing but different Sign In method found";
        message = 'Do you want to link to another signing method?';
        let accept = "Definitely";
        let deny = "Not now";
        this.util.showAlert(title,message,accept,deny).then(result =>{
          console.log(result);
          if(result){
            this.util.store.set('link',true);
            var mLink;
            this.util.store.get('link-from').then(data => {mLink = data;})
              .then(() =>{
                this.util.store.set('link-to',mLink);
                this.link_to = mLink;
                this.link = true;
              });
          } else {
            this.util.store.remove('link');
            this.link = false;
          }
        }).catch(() => {
          this.util.store.remove('link');
          this.link = false;
        });
      default:
        message = "We could not sign you in :( Check your for mistypes in your email or password";
    }
  }
}
