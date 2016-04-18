import {Page} from 'ionic-angular';
import {AudioTrack, AudioTrackComponent, AudioTrackPlayComponent, AudioTrackProgressComponent, AudioTrackProgressBarComponent, IAudioTrack, ITrackConstraint, AudioTimePipe, WebAudioProvider} from '../../providers/ionic-audio/ionic-audio';
import {Provider} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/page1/page1.html',
  directives: [AudioTrackComponent, AudioTrackPlayComponent, AudioTrackProgressComponent, AudioTrackProgressBarComponent],
  providers: [] //[new Provider(AudioTrack, {useClass: AudioTrack})] // alias for [AudioTrack]
})
export class Page1 {
  track: AudioTrack;
  myTracks: ITrackConstraint[];
  singleTrack: ITrackConstraint;
  allTracks: IAudioTrack[];
  selectedTrack: number;
   
  constructor(private _audioProvider: WebAudioProvider) {
    this.myTracks = [{
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Why Georgia',
      art: 'img/johnmayer.jpg'
    },
    {
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t30-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Who Says',
      art: 'img/johnmayer.jpg'
    }];
    
    this.singleTrack = {
      src: 'https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3',
      artist: 'Stephane Wrembel',
      title: 'Stephane Wrembel Live',
      art: 'img/Stephane.jpg'
    };
    
    // create an audio track instance to show API usage without directives
    this.track = new AudioTrack('https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3');
  }
  
  ngAfterContentInit() {
    this.allTracks = this._audioProvider.tracks; 
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
  
  playSelectedTrack() {
    this._audioProvider.play(this.selectedTrack);
  }
  
  pauseSelectedTrack() {
     this._audioProvider.pause(this.selectedTrack);
  }
  
  onTrackSelect() {
    
  }
  
  onTrackFinished(track: any) {
    console.log('Track finished', track)
  }
  
}
