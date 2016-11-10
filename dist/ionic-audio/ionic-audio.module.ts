import { NgModule, CUSTOM_ELEMENTS_SCHEMA }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import {AudioTrackComponent} from './ionic-audio-track-component';
import {AudioTrackProgressComponent, AudioTrackProgressBarComponent} from './ionic-audio-track-progress-component';
import {AudioTrackPlayComponent} from './ionic-audio-track-play-component';
import {AudioTimePipe} from './ionic-audio-time-pipe';

@NgModule({
  imports:      [ CommonModule, FormsModule, IonicModule  ],
  declarations: [ 
    AudioTrackComponent,
    AudioTrackProgressComponent, 
    AudioTrackProgressBarComponent,
    AudioTrackPlayComponent,
    AudioTimePipe
  ],
  exports:      [
    AudioTrackComponent,
    AudioTrackProgressComponent, 
    AudioTrackProgressBarComponent,
    AudioTrackPlayComponent,
    AudioTimePipe
  ],
  providers:    [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class IonicAudioModule { }

export * from './ionic-audio-interfaces';
export * from './ionic-audio-providers';
export * from './ionic-audio-web-track';
export * from './ionic-audio-cordova-track';
export * from './ionic-audio-track-component';
export * from './ionic-audio-track-progress-component';
export * from './ionic-audio-track-play-component';
export * from './ionic-audio-time-pipe';