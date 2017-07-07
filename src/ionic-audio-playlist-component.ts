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
  private _currentIndex: number;

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

  add(track: ITrackConstraint) {
    return this.tracks.push(track) - 1;
  }

  play(audioTrack?: IAudioTrack) {
    if (!audioTrack) {
      if (!this._currentTrack)
        this.playIndex(0) // start with first track
      else
        this._currentTrack.play();  // resume playback
    } else {
      // find track index and play
      let index = this._audioTracks.findIndex((track)=>track.id === audioTrack.id);
      this.playIndex(index);
    }
  }

  playIndex(index: number) {
    if (this._audioTracks.length <= index || index < 0) return;

    this._currentIndex = index;
    this._currentTrack = this._audioTracks[index];
    this._currentTrack.play();
  }

  pause(audioTrack?: IAudioTrack) {
    if (audioTrack) this._currentTrack = audioTrack;
    
    this._currentTrack && this._currentTrack.pause();
  }

  next() {
    if (this._currentIndex < this._audioTracks.length - 1) {
      // play next one
      console.log('Playlist playing next track');
      this.playIndex(++this._currentIndex);
    } else {
      // we reached the end of the playlist
      console.log('Playlist no more tracks to play');
      
      // TODO cannot set the following to undefined because it throws an error, needs investigation
      // Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked
      /*
        this._currentIndex = 0;
        this._currentTrack = this._audioTracks[0];
      */
    }
  }

  ngDoCheck() {
    // new tracks have been added to the list
    if (this.tracks.length > this._audioTracks.length) {
      let count = this.tracks.length - this._audioTracks.length;
      this.tracks.slice(this.tracks.length - count).forEach((track, index) => {
        console.log("ngDoCheck -> adding new track", track, index);
        let audioTrack: IAudioTrack = this._audioProvider.create(track);
        this._audioTracks.push(audioTrack);
      });
      console.log("ngDoCheck -> added new audio tracks", this._audioTracks);
    } else if (this.tracks.length < this._audioTracks.length) {
      // tracks have been removed from the list
      console.log("ngDoCheck -> audio tracks removed", this._audioTracks);
    }
  }
}