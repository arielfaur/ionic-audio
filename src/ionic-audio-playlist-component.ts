import { ITrackConstraint, IAudioTrack } from './ionic-audio-interfaces';
import { AudioProvider } from './ionic-audio-providers';
import { WebAudioTrack } from './ionic-audio-web-track';
import { CordovaAudioTrack } from './ionic-audio-cordova-track';

import { Component, DoCheck, EventEmitter, Output, Input } from '@angular/core';


/**
 * # ```<audio-playlist>``` 
 * 
 * Creates a playlist component
 * 
 * ## Usage
 * 
 * ````
 *   <audio-playlist [tracks]="myTracks">
 *   ...
 *   </audio-playlist>
 * ````
 * @element audio-track
 * @export
 * @class AudioPlaylistComponent
 */
@Component({
  selector: 'audio-playlist',
  template: '<ng-content></ng-content>'
})
export class AudioPlaylistComponent implements DoCheck {
  /**
   * Input property containing a JSON object with at least a src property
   * ````
   *   this.myTracks = [{
   *     src: 'https://www,mysite.com/myTrack.mp3',
   *     artist: 'Artist name',
   *     title: '...',
   *     art: 'img/artist.jpg',
   *     preload: 'metadata' // tell the plugin to preload metadata such as duration for this track
   *   },
   *   {...}
   *  ];
   * ````
   * @property tracks
   * @type {ITrackConstraint}
   */
  @Input() tracks: ITrackConstraint[] = [];

  /**
   * Output property expects an event handler to be notified whenever playback finishes
   * 
   * @property onFinish
   * @type {EventEmitter}
   */
  @Output() onFinish = new EventEmitter<ITrackConstraint>();

  private _audioTracks: IAudioTrack[] = [];
  private _currentTrack: IAudioTrack;

  constructor(private _audioProvider: AudioProvider) { }

  ngOnInit() {
    this._audioTracks = this.tracks.map(track => { 
        let audioTrack: IAudioTrack = this._audioProvider.create(track);
        return audioTrack;
      });
  }

  get audioTracks() {
    return this._audioTracks;
  }

  get currentTrack() {
    return this._currentTrack;
  }

  play(track?: IAudioTrack) {
    if (track) this._currentTrack = track;
    
    this._currentTrack && this._currentTrack.play();
  }

  pause(track?: IAudioTrack) {
    if (track) this._currentTrack = track;
    
    this._currentTrack && this._currentTrack.pause();
  }

  playLast() {
    if (this._audioTracks.length > 0) {
      this._currentTrack = this._audioTracks[this._audioTracks.length-1];
      this._currentTrack.play();
    }
  }

  start() {
    if (!this._currentTrack && this._audioTracks.length > 0) this.play(this._audioTracks[0]);
  }

  next(track: any) {
    console.log('Playlist track finished =>', track)
  }

  ngDoCheck() {
    if (this.tracks.length !== this._audioTracks.length) {
      this._audioTracks = this.tracks.map(track => {
        let audioTrack: IAudioTrack = this._audioProvider.create(track);
        return audioTrack;
      });

      console.log("ngOnChanges -> new audio tracks", this._audioTracks);
    }
  }
}