import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';

import {AudioProvider, WebAudioProvider} from 'ionic-audio/dist/ionic-audio';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type, provide} from '@angular/core';

@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {}, // http://ionicframework.com/docs/v2/api/config/Config/
  providers:  [provide(AudioProvider,  { useFactory: AudioProvider.factory })] // or use [WebAudioProvider] to force HTML5 Audio  
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}
