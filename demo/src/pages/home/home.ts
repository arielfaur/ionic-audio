import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AudioProvider, IAudioTrack } from 'ionic-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myTracks: any[];
  playlist: IAudioTrack[] = [];
  private _currentTrack: any;

  constructor(public navCtrl: NavController, private _audioProvider: AudioProvider) {
    // plugin won't preload data by default, unless preload property is defined within json object - defaults to 'none'
    this.myTracks = [{
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Why Georgia',
      art: 'assets/img/johnmayer.jpg',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
    },
    {
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t30-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Who Says',
      art: 'assets/img/johnmayer.jpg',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
    },
    
    {
      src: 'https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3',
      artist: 'Stephane Wrembel',
      title: 'Stephane Wrembel Live',
      art: 'assets/img/Stephane.jpg',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
    }];
  }

  playTrack(track: any) {
    this._currentTrack = track;

    this.playlist = this._audioProvider.tracks;
  } 
  addTrack(track: any) {
    this._audioProvider.create(track);

    this.playlist = this._audioProvider.tracks;
  }

  get currentTrack() {
    return this._currentTrack;
  }

  set currentTrack(value: IAudioTrack) {
    this._currentTrack = value;
  }

  onTrackFinished(track: any) {
    console.log('Track finished', track)
  }

}
