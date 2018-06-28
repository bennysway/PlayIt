import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
//FireBase
import {AngularFireModule} from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { masterFirebaseConfig } from './api-keys';

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
import { UserServiceProvider } from '../providers/user-service/user-service';

export const firebaseAuth = {
    apiKey: masterFirebaseConfig.apiKey,
    authDomain: masterFirebaseConfig.authDomain,
    databaseURL: masterFirebaseConfig.databaseURL,
    projectId: masterFirebaseConfig.projectId,
    storageBucket: masterFirebaseConfig.storageBucket,
    messagingSenderId: masterFirebaseConfig.messagingSenderId
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
    AngularFireDatabaseModule,
    HttpClientModule,
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
    SaltyProvider,
    UserServiceProvider
  ]
})
export class AppModule {}
