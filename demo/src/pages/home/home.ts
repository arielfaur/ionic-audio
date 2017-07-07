import { Component, ViewChild } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AudioProvider, IAudioTrack, ITrackConstraint } from 'ionic-audio';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myTracks: ITrackConstraint[];
  trackList: ITrackConstraint[] = [];

  //@ViewChild('playlist') playlist: AudioPlaylistComponent;
  private _currentTrack: ITrackConstraint;
  private _currentIndex: number;

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

  add(track: ITrackConstraint) {
    this.trackList.push(track);
  }

  play(track: ITrackConstraint, index?: number) {
    console.log("Playing track", index)
    this._currentTrack = track;
    this._currentIndex = index;
  }

  next() {
    if (this._currentIndex < this.trackList.length - 1) {
      this._currentTrack = this.trackList[++this._currentIndex];
    }
  }

  get currentTrack() {
    return this._currentTrack;
  }

  set currentTrack(value: ITrackConstraint) {
    this._currentTrack = value;
  }

  onTrackFinished(track: any) {
    console.log('Track finished', track)
  }

}
