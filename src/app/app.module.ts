import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from "@ionic/storage";
//FireBase
import { masterFirebaseConfig } from './api-keys';
//Providers
import { HttpClientModule } from "@angular/common/http";
import { GooglePlus } from "@ionic-native/google-plus";
import { Facebook } from "@ionic-native/facebook";
import { VideoProvider } from '../providers/video/video';
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from "../pages/register/register";
import { PlayerPage } from "../pages/player/player";
import { TestPage } from "../pages/test/test";
import { UtilProvider } from '../providers/util/util';
import { QuickActionsPage } from "../pages/quick-actions/quick-actions";
import { LinkAccountPage } from "../pages/link-account/link-account";
import { SettingsPage } from "../pages/settings/settings";
import {AboutPage} from "../pages/about/about";
import {AboutPageModule} from "../pages/about/about.module";
import {LinkAccountPageModule} from "../pages/link-account/link-account.module";
import {PlayerPageModule} from "../pages/player/player.module";
import {QuickActionsPageModule} from "../pages/quick-actions/quick-actions.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {TestPageModule} from "../pages/test/test.module";
import {HomePageModule} from "../pages/home/home.module";
import * as firebase from "firebase";

export const firebaseAuth = {
    apiKey: masterFirebaseConfig.apiKey,
    authDomain: masterFirebaseConfig.authDomain,
    databaseURL: masterFirebaseConfig.databaseURL,
    projectId: masterFirebaseConfig.projectId,
    storageBucket: masterFirebaseConfig.storageBucket,
    messagingSenderId: masterFirebaseConfig.messagingSenderId
};

@Injectable()
export class WindowWrapper extends Window {

}
export function getWindow() { return window; }
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AboutPageModule,
    LinkAccountPageModule,
    PlayerPageModule,
    QuickActionsPageModule,
    RegisterPageModule,
    SettingsPageModule,
    TestPageModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    PlayerPage,
    TestPage,
    AboutPage,
    QuickActionsPage,
    LinkAccountPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: WindowWrapper, useValue: getWindow()},
    GooglePlus,
    UtilProvider,
    Facebook,
    VideoProvider,
  ]
})
export class AppModule {}
