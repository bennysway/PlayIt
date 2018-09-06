import { Component, ViewChild } from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { PlayerPage} from "../player/player";
import { Platform } from 'ionic-angular';
import * as firebase from "firebase";
//Providers
import { GooglePlus } from "@ionic-native/google-plus";
import { UtilProvider } from "../../providers/util/util";
import { googlePlusConfig } from "../../app/api-keys";
import {LinkAccountPage} from "../link-account/link-account";
import { Facebook } from "@ionic-native/facebook";
import {AboutPage} from "../about/about";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('email') eml;
  @ViewChild('password') pwd;
  autoSignIn: boolean = false;
  isDeviceMobile : boolean;
  users: any;
  link:boolean = false;
  link_to = "";
  signInMethod = "";
  device_name: string = "none";
  device_icon: string = "none";
  constructor(public navCtrl: NavController ,
              private plt: Platform,
              private util: UtilProvider,
              private googlePlus : GooglePlus,
              private facebook : Facebook,
              private events : Events) {
    this.checkDevice();
    this.util.store.get('link').then(result => {
      this.link = result;
      this.util.store.get('link-to').then(data =>{ this.link_to = data;});
    }).then(() => {
      this.signInAutomatically();

    }).catch(() => {
      this.signInAutomatically();
    });
    this.util.store.get('autoSignIn').then(data =>{
      if(data != null)
        this.signInWithProvider(data);
    });
    let physicalScreenWidth = window.screen.width * window.devicePixelRatio;
    let physicalScreenHeight = window.screen.height * window.devicePixelRatio;
    this.util.store.set('width',physicalScreenWidth);
    this.util.store.set('height', physicalScreenHeight);

  }

  signIn(){
    this.util.showToast("Signing in with email ... ");
    this.util.store.set('link-from',"Email");
    if(this.eml.value != "" && this.pwd.value != ""){
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() =>{
          firebase.auth().signInWithEmailAndPassword(this.eml.value, this.pwd.value)
            .then(data =>{
              this.util.store.set('eml', this.eml.value);
              this.util.store.set('pwd', this.pwd.value);
              this.signInSuccess();
            })
            .catch(error =>{
              console.log(error.code);
              this.signInFail(error.code);
            });
        });
    } else {
      this.util.showToast("One or more of the credentials are empty");
    }

  }
  signInWithProvider(method: string){
    let provider;
    this.util.showLoader("Signing in with " + method + " ... ");
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
        case "Facebook":
          this.facebookSignIn().then(() => this.signInSuccess()).catch(error => this.signInFail(error.message));
          break;
        default:
          firebase.auth().signInWithPopup(provider)
            .then(() =>{
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
      firebase.auth().signInWithPopup(provider).then(() =>{
        return firebase.auth().getRedirectResult();
      }).then(data => {
        console.log("Signed in with " + method);
        this.signInSuccess();
      }).catch(error =>{
        this.util.showToast("Could not sign in with " + method);
        console.log(error.message);
        console.log(error.code);
        this.signInFail(error.code);
      });
    }
  }
  firebaseSignInWithProvider(method: string){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() =>{
        this.signInMethod = method;
        this.signInWithProvider(method);
      })
      .catch(error => console.log(error));
  }

  signInAutomatically(){
    if(firebase.auth().currentUser){
      this.signInSuccess();
    }
    firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
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
      this.isDeviceMobile = true;
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
      this.isDeviceMobile = false;
      this.device_name = "Browser";
      this.device_icon = "browsers";
    }
  }
  //Google
  async googleSignIn(): Promise<any>{
    try{
      const gPlusUser = await this.googlePlus.login({
        'webClientId' : googlePlusConfig.webClientId,
        //'offline' : false,
        'scopes' : 'email'
      });
      return await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken))
    }
    catch(error) {
      this.signInFail(error.code);
      console.log(error);
    }
  }

  async facebookSignIn(){
    try{
      const fbCredential = await this.facebook.login(['public_profile', 'user_friends', 'email']);
      console.log('meme');
      return await firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.FacebookAuthProvider.credential(fbCredential.authResponse.accessToken));
    }
    catch(error) {
      this.signInFail(error.code);
      console.log(error);
    }
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  test(){
    console.log("Clicked Test");
    this.navCtrl.push(AboutPage);
  }
  signInSuccess() {
    try{
      if(firebase.auth().currentUser){
        this.util.showToast("Signed in 😊");
        this.events.publish('signInSuccess');
        if(this.autoSignIn){
          this.util.store.set('autoSignIn', this.signInMethod);
          console.log("Saved automatic signin with " + this.signInMethod);
        }
        else{
          this.util.store.remove('autoSignIn');
        }
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
    } catch (error){
      console.log(error);
      this.signInFail(error.code);
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
      case 'auth/popup-closed-by-user':
        message = "You kinda closed your sign in window😂";
        this.util.showToast(message);
        break;
      case 'auth/user-disabled':
        message = 'This account is blocked 😞. Please use another account or register';
        this.util.showToast(message);
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
            let mLink;
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
        break;
      case 'auth/popup-blocked':
        this.util.showToast("You might have a pop-up blocker. Can you please disable it from this app?");
        break;
      default:
        message = "We could not sign you in 😞 Try again later";
        this.util.showToast(message);
    }
  }
}
