import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen  } from '@ionic-native/splash-screen';
import { StatusBar  } from '@ionic-native/status-bar';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { IonicAudioModule, AudioProvider, WebAudioProvider, audioProviderFactory } from 'ionic-audio';

let pages = [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
];

/**
 * Sample custom factory function to use with ionic-audio
 */
export function myCustomAudioProviderFactory() {
  return new WebAudioProvider();
}

export function providers() {
  return [{provide: ErrorHandler, useClass: IonicErrorHandler}, SplashScreen, StatusBar];
}
export function entryComponents() {
  return pages;
}
export function declarations() {
  return pages;
}

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicAudioModule.forRoot({ provide: AudioProvider, useFactory: myCustomAudioProviderFactory }), 
    // or use custom function above to force a specific provider
    // { provide: AudioProvider, useFactory: myCustomAudioProviderFactory }
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers(),
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
