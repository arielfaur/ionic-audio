import { NgModule, ModuleWithProviders, Optional, CUSTOM_ELEMENTS_SCHEMA }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { IonicModule } from 'ionic-angular';

import {AudioTrackComponent} from './ionic-audio-track-component';
import {AudioTrackProgressComponent, AudioTrackProgressBarComponent} from './ionic-audio-track-progress-component';
import {AudioTrackPlayComponent} from './ionic-audio-track-play-component';
import {AudioTimePipe} from './ionic-audio-time-pipe';
import {AudioProvider, CordovaMediaProvider, WebAudioProvider} from './ionic-audio-providers';

export function declarations() {
  return [
    AudioTrackComponent,
    AudioTrackProgressComponent, 
    AudioTrackProgressBarComponent,
    AudioTrackPlayComponent,
    AudioTimePipe
  ] 
}

@NgModule({
  imports:      [ CommonModule, IonicModule  ],
  declarations: declarations(),
  exports:      declarations(),
  providers:    [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IonicAudioModule { 
  /**
   * Configures Ionic Audio to use either Cordova or HTML5 audio.
   * If no ```audioProvider``` is set it will automatically choose one based on the current environment
   */
  static forRoot(audioProvider?: any): ModuleWithProviders {
    return {
      ngModule: IonicAudioModule,
      providers: audioProvider
    };
  }
}
