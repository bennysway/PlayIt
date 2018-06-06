import {Component, ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { RegisterPage} from "../register/register";
import { AngularFireAuth } from 'angularfire2/auth';
import {PlayerPage} from "../player/player";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('email') eml;
  @ViewChild('password') pwd;
  constructor(public navCtrl: NavController ,
              public alertCtrl: AlertController,
              private fire: AngularFireAuth) {

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

  register(){
    this.navCtrl.push(RegisterPage);
  }

  test(){
    this.navCtrl.setRoot(PlayerPage);
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
