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
      src: './assets/02 - Drifting.mp3',
      artist: 'Jimi Hendrix',
      title: 'Drifting',
      art: 'img/hendrix.jpg'
    },
    {
      src: './assets/02 - Tonight. Tonight. Tonight.mp3',
      artist: 'Genesis',
      title: 'Tonight. Tonight. Tonight.',
      art: 'img/genesis.jpg'
    }];
    
    this.singleTrack = {
      src: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
      artist: 'The Police',
      title: 'Message in a bottle',
      art: 'https://s3.amazonaws.com/ionic-audio/The_Police_Greatest_Hits.jpg'
    };
    
    // create an audio track instance to show API usage without directives
    this.track = new AudioTrack('https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3');
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
