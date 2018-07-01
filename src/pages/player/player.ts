import { Component } from '@angular/core';
import { PopoverController } from "ionic-angular";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QuickActionsPage } from "../quick-actions/quick-actions";

/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popOver: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerPage');
  }

  showPopOver(myEvent){
    let pop = this.popOver.create(QuickActionsPage);
    pop.present({
      ev : myEvent
    })
  }

}
