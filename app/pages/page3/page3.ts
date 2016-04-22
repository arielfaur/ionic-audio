import {Page} from 'ionic-angular';
import {AudioTrack, CordovaAudioTrack, AudioTrackComponent, AudioTrackPlayComponent, AudioTrackProgressComponent, AudioTrackProgressBarComponent, IAudioTrack, ITrackConstraint, AudioTimePipe, WebAudioProvider, AudioProvider} from '../../providers/ionic-audio/ionic-audio';


@Page({
  templateUrl: 'build/pages/page3/page3.html',
  pipes: [AudioTimePipe]
})
export class Page3 {
  track: IAudioTrack;
  
  constructor() {
    // create an audio track instance to show API usage without using components
    this.track = new AudioTrack('https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3');
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
