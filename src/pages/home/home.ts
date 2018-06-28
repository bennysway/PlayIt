import {Component, ViewChild} from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { RegisterPage} from "../register/register";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from "angularfire2/database";
import {PlayerPage} from "../player/player";
import { Facebook } from '@ionic-native/facebook';
import { Platform } from 'ionic-angular';
import { TestPage} from "../test/test";
import * as firebase from "firebase";
import { SaltyProvider} from "../../providers/salty/salty";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})
export class HomePage {

  @ViewChild('email') eml;
  @ViewChild('password') pwd;
  isLoggedIn:boolean = false;
  users: any;
  device_name: string = "none";
  device_icon: string = "none";
  constructor(public navCtrl: NavController ,
              public alertCtrl: AlertController,
              public toast: ToastController,
              private fire: AngularFireAuth,
              private fb: Facebook,
              public plt: Platform,
              public db: AngularFireDatabase,
              private salt: SaltyProvider) {
    this.checkDevice();
    this.signInAutomatically();
  }

  signIn(){
    if(this.eml.value != "" && this.pwd.value != ""){
      this.fire.auth.signInWithEmailAndPassword(this.eml.value, this.pwd.value)
        .then(data =>{
          this.signInSuccess();
        })
        .catch(error =>{
          console.log(error.code);
          this.signInFail(error.code);
        });
    } else {
      this.credentialEmpty();
    }

  }
  signInWithProvider(method: string){
    let provider;
    this.showToast("Signing in with " + method + " ... ");
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
    firebase.auth().signInWithRedirect(provider).then(function() {
      return firebase.auth().getRedirectResult();
    }).then(result => {
      this.showToast("Signed in :)");
      console.log("Signed in with " + method);
    }).catch(error =>{
      this.showToast("Could not sign in with " + method);
      console.log(error.message);
    });
  }
  signInAutomatically(){
    firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        console.log("Succeful login.");
        this.showToast("Signed in :)");
      }
    }).catch(error => {
      this.showToast("Could not sign in");
      console.log(error.message);
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

  //Facebook
  facebookAutoSignIn(){
    this.fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if(res.status === "connect") {
          this.isLoggedIn = true;
          this.signInSuccess();
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log(e));
  }
  facebookSignIn(){
    if(this.plt.is("mobile")){
      this.fb.login(['public_profile', 'user_friends', 'email'])
        .then(res => {
          if(res.status === "connected") {
            this.isLoggedIn = true;
            this.getUserDetail(res.authResponse.userID);
            //Todo
            this.signInSuccess();
          } else {
            this.isLoggedIn = false;
            this.signInFail(res.status);
          }
        })
        .catch(e => {
          console.log('Error logging into Facebook', e);
          this.signInFail(e);
        });
    }
    else {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.fire.auth.signInWithPopup(provider)
        .then(data =>{
          this.showToast(this.fire.auth.currentUser.email);
        })
        .catch(error =>{

        });

    }

  }
  facebookSignOut(){
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));

  }
  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        this.users = res;
        this.showToast(this.users.email);
      })
      .catch(e => {
        console.log(e);
      });
  }
  /*TODO:
  *Don't forget to implement logout
  */

  //Google
  googleSignIn(){
    this.showToast("Signing in with Google");
    let provider = new firebase.auth.GoogleAuthProvider();
    this.fire.auth.signInWithRedirect(provider)
      .then(() =>{
        this.fire.auth.getRedirectResult()
          .then(data =>{
            this.showToast(data.user.email);
            console.log("Done");
          })
          .catch(error => {
            this.showToast(error.message);
          });
      })
      .catch(error => {
      this.showToast(error.message);
    });
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  test(){
    this.navCtrl.push(TestPage);

  }
  showToast(text: string) {
    let toast = this.toast.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present(toast);
  }


  signInSuccess() {
    const alert = this.alertCtrl.create({
      title: 'Success',
      message: 'Welcome to PlayIt',
      buttons: [
        {
          text : 'Start',
          handler : () => {
           this.navCtrl.setRoot(PlayerPage);
          }
        }
      ]
    });
    alert.present();
  }

  signInFail(code : string) {
    let message;
    switch (code){
      case 'auth/invalid-email':
        message = 'You have entered an invalid email address';
        break;
      case 'auth/user-not-found':
        message = 'Email does not exist. Please register';
        break;
      case 'auth/wrong-password':
        message = 'You entered a wrong password';
        break;
      case 'auth/user-disabled':
        message = 'Account is blocked. Please use another account or register';
        break;
      default:
        message = "We could not sign you in :( Check your for mistypes in your email or password";
    }
    const alert = this.alertCtrl.create({
      title: 'Failed',
      message: message,
      buttons: ['Back'],
    });
    alert.present();
  }

  credentialEmpty() {
    const alert = this.alertCtrl.create({
      title: 'Failed',
      message: 'Empty email or password',
      buttons: ['Back']
    });
    alert.present();
  }

}
