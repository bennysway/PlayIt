import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from "../pages/register/register";
import { PlayerPage } from "../pages/player/player";
//FireBase
import {AngularFireModule} from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';

const firebaseAuth = {
    apiKey: "AIzaSyArVjCC2uKXgdiVWhXhoz0pTpnDDB_GDPY",
    authDomain: "playit-45607.firebaseapp.com",
    databaseURL: "https://playit-45607.firebaseio.com",
    projectId: "playit-45607",
    storageBucket: "playit-45607.appspot.com",
    messagingSenderId: "837369162014"
};
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterPage,
    PlayerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    PlayerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
