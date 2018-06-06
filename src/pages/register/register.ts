import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import {PlayerPage} from "../player/player";
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private fire: AngularFireAuth) {
  }

  @ViewChild('username') usr;
  @ViewChild('email') eml;
  @ViewChild('password') pwd;

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  signUp() {
    if (this.usr.value != "" && this.pwd.value != "" && this.eml.value != "") {
      this.fire.auth.createUserWithEmailAndPassword(this.eml.value, this.pwd.value)
        .then(data => {
          this.signUpSuccess();
        })
        .catch(error =>{
          console.log(error.code);
          this.signUpFail(error.code);
        })
      //this will return a promise, for asynchronous coding
    }
    else
      this.credentialEmpty();
  }

  signUpSuccess() {
    const alert = this.alertCtrl.create({
      title: 'Success',
      message: 'Welcome to PlayIt',
      buttons: [{
        text : 'Next',
        handler : () =>{
          this.fire.auth.signInWithEmailAndPassword(this.eml.value, this.pwd.value)
            .then(data =>{
              this.navCtrl.setRoot(PlayerPage);
            })
            .catch(error => {
              console.log(error.code);
              this.signUpFail(error.code);
            })
        }
      }

      ]
    });
    alert.present();
  }

  signUpFail(code : string) {
    let message;
    switch (code){
      case 'auth/invalid-email':
        message = 'You have entered an invalid email address';
        break;
      case 'auth/weak-password':
        message = 'Password is weak. Enter a password of length 6 and above';
        break;
      default:
        message = "We could not sign you up :( Check your for mistypes in your email or password";
    }
    const alert = this.alertCtrl.create({
      title: 'Failed',
      message: message,
      buttons: ['Try again',
        {
          text:'Go back Home',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
    });
    alert.present();
  }

  credentialEmpty() {
    const alert = this.alertCtrl.create({
      title: 'Failed',
      message: 'Empty email, username or password',
      buttons: ['Back']
    });
    alert.present();
  }
}
