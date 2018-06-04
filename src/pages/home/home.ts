import {Component, ViewChild} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('username') usr;
  @ViewChild('password') pwd
  constructor(public navCtrl: NavController ,
              public alertCtrl: AlertController) {

  }

  signIn(){
    console.log(this.usr.value);
    console.log(this.pwd.value);
    if(this.usr.value != "" && this.pwd.value != ""){
      const alert = this.alertCtrl.create({
        title: 'Success',
        subTitle: 'You have successfully signed in',
        buttons: ['Next']
      });
      alert.present();
    } else {
      const alert = this.alertCtrl.create({
        title: 'Failed',
        subTitle: 'Missing username/password!',
        buttons: ['Back']
      });
      alert.present();
    }

  }

}
