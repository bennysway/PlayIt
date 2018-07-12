import { Component, ViewChild } from '@angular/core';
import { NavController} from 'ionic-angular';
import { RegisterPage } from "../register/register";
import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerPage} from "../player/player";
import { Platform } from 'ionic-angular';
import * as firebase from "firebase";
//Providers
import { GooglePlus } from "@ionic-native/google-plus";
import { UtilProvider } from "../../providers/util/util";
import { googlePlusConfig } from "../../app/api-keys";
import {LinkAccountPage} from "../link-account/link-account";
import { Facebook } from "@ionic-native/facebook";
import {TestPage} from "../test/test";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('email') eml;
  @ViewChild('password') pwd;
  autoSignIn: boolean = false;
  users: any;
  link:boolean = false;
  link_to = "";
  device_name: string = "none";
  device_icon: string = "none";
  constructor(public navCtrl: NavController ,
              private fire: AngularFireAuth,
              private plt: Platform,
              private util: UtilProvider,
              private googlePlus : GooglePlus,
              private facebook : Facebook) {
    this.checkDevice();
    this.util.store.get('link').then(result => {
      this.link = result;
      this.util.store.get('link-to').then(data =>{ this.link_to = data;});
    }).then(() => {
      this.signInAutomatically();

    }).catch(() => {
      this.signInAutomatically();
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
      firebase.auth().signInWithRedirect(provider).then(() =>{
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
  signInAutomatically(){
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
        'scopes' : 'email'
      });
      return await this.fire.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken))
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
    this.navCtrl.push(TestPage);
  }
  signInSuccess() {
    try{
      console.log(firebase.auth().currentUser);
      if(firebase.auth().currentUser){
        this.util.showToast("Signed in 😊");
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
      default:
        message = "We could not sign you in 😞 Try again later";
        this.util.showToast(message);
    }
  }
}
