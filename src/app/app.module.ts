import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//FireBase
import {AngularFireModule} from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
//Providers
import { Facebook } from "@ionic-native/facebook";
import { SaltyProvider } from '../providers/salty/salty';
import { HttpClientModule } from "@angular/common/http";
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from "../pages/register/register";
import { PlayerPage } from "../pages/player/player";
import { TestPage } from "../pages/test/test";

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
    PlayerPage,
    TestPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    PlayerPage,
    TestPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    SaltyProvider
  ]
})
export class AppModule {}
