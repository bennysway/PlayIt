import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";
//FireBase
import {AngularFireModule} from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from "angularfire2/database";
import { masterFirebaseConfig } from './api-keys';
//Providers
import { SaltyProvider } from '../providers/salty/salty';
import { HttpClientModule } from "@angular/common/http";
import { GooglePlus } from "@ionic-native/google-plus";
import { Facebook } from "@ionic-native/facebook";
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from "../pages/register/register";
import { PlayerPage } from "../pages/player/player";
import { TestPage } from "../pages/test/test";
import { UserServiceProvider } from '../providers/user-service/user-service';
import { UtilProvider } from '../providers/util/util';
import { QuickActionsPage } from "../pages/quick-actions/quick-actions";
import { LinkAccountPage } from "../pages/link-account/link-account";
import { VideoProvider } from '../providers/video/video';

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
    TestPage,
    QuickActionsPage,
    LinkAccountPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    PlayerPage,
    TestPage,
    QuickActionsPage,
    LinkAccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Window, useValue: window},
    SaltyProvider,
    UserServiceProvider,
    GooglePlus,
    UtilProvider,
    Facebook,
    VideoProvider
  ]
})
export class AppModule {}
