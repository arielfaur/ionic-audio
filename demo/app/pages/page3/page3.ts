import {Component, Provider} from '@angular/core';
import {WebAudioTrack, IAudioTrack, AudioTimePipe} from 'ionic-audio/dist/ionic-audio';


@Component({
  templateUrl: 'build/pages/page3/page3.html',
  pipes: [AudioTimePipe]
})
export class Page3 {
  track: IAudioTrack;
  
  constructor() {
    // create an audio track instance to show API usage without using components
    this.track = new WebAudioTrack('https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3');
  }
  
  play() {
    this.track.play();
  }
  
  pause() {
    this.track.pause();
  }
  
  stop() {
    this.track.stop();
  }
}
