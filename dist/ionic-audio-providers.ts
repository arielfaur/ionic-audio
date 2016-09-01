import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 
import {Injectable, Inject, Optional} from '@angular/core';
import {WebAudioTrack} from './ionic-audio-web-track';
import {CordovaAudioTrack} from './ionic-audio-cordova-track';


/**
 * Base class for audio providers
 * 
 * @export
 * @abstract
 * @class AudioProvider
 * @implements {IAudioProvider}
 */
@Injectable()
export abstract class AudioProvider implements IAudioProvider {
  protected static tracks: IAudioTrack[] = [];
  protected _current: number;
  
  /**
   * Creates an audio provider based on the environment.
   * If running from within a browser, then defaults to HTML5 Audio. If running on a device, it will check for Cordova and Media plugins and use
   * a native audio player, otherwise falls back to HTML5 audio.  
   * 
   * @method factory
   * @static
   * @return {IAudioProvider} An IAudioProvider instance 
   */
  static factory() {
    return window.hasOwnProperty('cordova') && window.hasOwnProperty('Media') ? new CordovaMediaProvider() : new WebAudioProvider();
  }
  
  constructor() {
  }
  
  /**
   * Creates an IAudioTrack instance from a JSON object.
   * Not implemented in base class.
   * 
   * @method create
   * @param {ITrackConstraint} track A JSON object containing at least a src property
   * @return null
   */
  create(track: ITrackConstraint) {
    console.error('Not implemented in base class');
    return null;
  }
  
  /**
   * Adds an existing IAudioTrack instance to the array of managed tracks.
   *
   * @method add 
   * @param {IAudioTrack} audioTrack An instance of IAudioTrack
   */
  add(audioTrack: IAudioTrack) {
    AudioProvider.tracks.push(audioTrack);  
  };
  
  /**
   * Plays a given track.
   * 
   * @method play
   * @param {number} index The track id
   */
  play(index: number) {
    if (index===undefined || index > AudioProvider.tracks.length-1) return;
    this._current = index;
    AudioProvider.tracks[index].play();  
  };
  
  /**
   * Pauses a given track.
   * 
   * @method pause
   * @param {number} [index] The track id, or if undefined it will pause whichever track currently playing
   */
  pause(index?: number) {
    if (this._current===undefined || index > AudioProvider.tracks.length-1) return;
    index = index || this._current;
    AudioProvider.tracks[index].pause();
  };
  
  /**
   * Stops a given track.
   * 
   * @method stop
   * @param {number} [index] The track id, or if undefined it will stop whichever track currently playing
   */
  stop(index?: number) {
    if (this._current===undefined || index > AudioProvider.tracks.length-1) return;
    index = index || this._current;
    AudioProvider.tracks[index].stop();
    this._current = undefined;
  };
  seekTo(time){
    var index;
    AudioProvider.tracks[index].seekTo(time);
  }
  /**
   * Gets an array of tracks managed by this provider
   * 
   * @property tracks
   * @readonly
   * @type {IAudioTrack[]}
   */
  public get tracks() : IAudioTrack[] {
    return AudioProvider.tracks;
  }
  
  /**
   * Gets current track id
   * 
   * @property current
   * @type {number}
   */
  public get current() : number {
    return this._current;
  }
  
  /**
   * Sets current track id
   * 
   * @property current
   */
  public set current(v : number) {
    this._current = v;
  }
  
}

/**
 * Creates an HTML5 audio provider
 * 
 * @export
 * @class WebAudioProvider
 * @constructor
 * @extends {AudioProvider}
 */
@Injectable()
export class WebAudioProvider extends AudioProvider {
  public audioTrack;
  constructor() {
    super();
    console.log('Using Web Audio provider');
  }
  
  create(track: ITrackConstraint) {
    this.audioTrack = new WebAudioTrack(track.src, track.preload);  
    Object.assign(this.audioTrack, track);
    let trackId = WebAudioProvider.tracks.push(this.audioTrack);
    this.audioTrack.id = trackId-1; 
    return this.audioTrack;
  }
}

/**
 * Creates a Cordova audio provider
 * 
 * @export
 * @class CordovaMediaProvider
 * @constructor
 * @extends {AudioProvider}
 */
@Injectable()
export class CordovaMediaProvider extends AudioProvider {
  
  constructor() {
    super();
    console.log('Using Cordova Media provider');
  }
  
  create(track: ITrackConstraint) {
    let audioTrack = new CordovaAudioTrack(track.src);  
    Object.assign(audioTrack, track);
    let trackId = CordovaMediaProvider.tracks.push(audioTrack);
    audioTrack.id = trackId-1; 
    return audioTrack;
  }
  
}