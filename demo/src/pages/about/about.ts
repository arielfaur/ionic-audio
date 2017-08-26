import { Component } from '@angular/core';

import { AudioProvider, IAudioTrack, ITrackConstraint } from 'ionic-audio';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  myTracks: ITrackConstraint[];
  allTracks: any[];
  selectedTrack: any;

  constructor(private _audioProvider: AudioProvider) {
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

  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the API
    this.allTracks = this._audioProvider.tracks; 
  }
  
  playSelectedTrack() {
    // use AudioProvider to control selected track 
    this._audioProvider.play(this.selectedTrack);
  }
  
  pauseSelectedTrack() {
     // use AudioProvider to control selected track 
     this._audioProvider.pause(this.selectedTrack);
  }
         
}
