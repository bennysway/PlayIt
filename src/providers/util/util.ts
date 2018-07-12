import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";

@Injectable()
export class UtilProvider {

  constructor(public http: HttpClient,
              private toast: ToastController,
              private alert: AlertController,
              public store: Storage) {
  }

  showToast(text: string) {
    let toast = this.toast.create({
      message: text,
      duration: 2000,
      position: 'top'
    });
    toast.present(toast);
  }
  showAlert(title: string,
            message: string,
            confirmMessage: string,
            denyMessage: string): Promise<boolean> {
    return new Promise<boolean>((accept,deny) =>{
      let alertConst = this.alert.create({
        title: title,
        message: message,
        buttons: [{
          text : confirmMessage,
          handler: () => {
            alertConst.dismiss().then(() => {accept(true); });
            return true;
          }
        },{
          text: denyMessage,
          handler: () => {
            alertConst.dismiss().then(() => {accept(false); deny(true); });
            return false;
          }
        }]
      });
      alertConst.present().catch(error => console.log(error.message));
    });
  }


}
