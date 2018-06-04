import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
              public alertCtrl: AlertController) {
  }

  @ViewChild('myName') name;
  @ViewChild('username') usr;
  @ViewChild('password') pwd;

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  signUp(){
    if(this.usr.value != "" && this.pwd.value != "" && this.name.value != ""){
      const alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'Welcome to PlayIt, ' + this.name.value,
        buttons: ['Next']
      });
      alert.present();
    } else {
      const alert = this.alertCtrl.create({
        title: 'Failed',
        subTitle: 'Missing field!',
        buttons: ['Back']
      });
      alert.present();
    }

  }

}
