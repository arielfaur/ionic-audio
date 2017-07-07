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

  private _currentTrack: ITrackConstraint;
  private _currentIndex: number;

  constructor(private _audioProvider: AudioProvider) { }

  ngOnInit() {

  }

  get currentTrack() {
    return this._currentTrack;
  }

  add(track: ITrackConstraint) {
    return this.tracks.push(track) - 1;
  }

  play(index?: number) {
    if (index === this._currentIndex) return;

  }

  pause(audioTrack?: IAudioTrack) {

  }

  next() {
    
  }

  ngDoCheck() {
   

  }

}