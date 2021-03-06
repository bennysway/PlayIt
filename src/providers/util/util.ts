import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ToastController, AlertController, LoadingController, Loading} from "ionic-angular";
import { Storage } from "@ionic/storage";

@Injectable()
export class UtilProvider {
  loading :Loading;

  constructor(public http: HttpClient,
              private toast: ToastController,
              private alert: AlertController,
              public store: Storage,
              public loadCtrl: LoadingController) {
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
  showPrompt(title: string,
             message: string,
             placeHolder : string,
             confirmMessage: string,
             denyMessage: string) : Promise<string>{
    return new Promise<string>((accept) =>{
      let prompt = this.alert.create({
        title: title,
        message: message,
        inputs: [
          {
            name: 'input',
            placeholder: placeHolder
          },
        ],
        buttons: [
          {
            text: denyMessage,
            handler: () => {
              console.log(title + " prompt closed.");
            }
          },
          {
            text: confirmMessage,
            handler: data => {
              accept(data.input);
            }
          }
        ]
      });
      prompt.present();
    });
  }
  showLoader(message : string){
    let loading = this.loadCtrl.create({
      content: message,
      dismissOnPageChange : true,
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 6000);
  }
  showSelectList(title : string,
                 list : Array<string>) : Promise<string>{
    return new Promise<string>(resolve =>{
      let alert = this.alert.create();
      alert.setTitle(title);
      list.forEach(item =>{
        alert.addInput({
          type: 'radio',
          label: item,
          value : item,
          checked : false
        });
      });
      alert.addButton('Cancel');
      alert.addButton({
        text : 'OK',
        handler: data => {
          resolve(data);
        }
      });
      alert.present();
    });
  }
}
