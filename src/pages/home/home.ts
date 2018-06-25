import {Component, ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { RegisterPage} from "../register/register";
import { AngularFireAuth } from 'angularfire2/auth';
import {PlayerPage} from "../player/player";
import { Facebook } from '@ionic-native/facebook';
import { Platform } from 'ionic-angular';
import { TestPage} from "../test/test";
import * as firebase from "firebase"; firebase;


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
              private fire: AngularFireAuth,
              private fb: Facebook,
              public plt: Platform) {
    this.facebookAutoSignIn();
    this.checkDevice();
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
  checkDevice(){
    if(this.plt.is("mobile")){
      if(this.plt.is("android")){
        this.device_name = "Android";
        this.device_icon = "logo-android";
      }
      if(this.plt.is("iphone")){
        this.device_name = "iPhone";
        this.device_icon = "logo_apple";
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
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
          this.signInSuccess();
        } else {
          this.isLoggedIn = false;
          this.signInFail(res.status);
        }
      })
      .catch(e => {
        console.log('Error logging into Facebook', e)
        this.signInFail(e);
      });
  }
  facebookSignOut(){
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));

  }
  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.users = res;
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

  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  test(){
    this.navCtrl.push(TestPage);
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
