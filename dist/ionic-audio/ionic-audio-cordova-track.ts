import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 
import {Injectable, Inject, Optional} from '@angular/core';

declare let Media: any;

/**
 * Cordova Media audio track
 * 
 * @export
 * @class CordovaAudioTrack
 * @constructor
 * @implements {IAudioTrack}
 */
@Injectable()
export class CordovaAudioTrack implements IAudioTrack {
  private audio: any;
  public isPlaying: boolean = false;
  public isFinished: boolean = false;
  private _progress: number = 0;
  private _completed: number = 0;
  private _duration: number;
  private _id: number;
  private _isLoading: boolean;
  private _hasLoaded: boolean;
  private _timer: any;
  
  constructor(public src: string) {
    if (window['cordova'] === undefined || window['Media'] === undefined) {
      console.log('Cordova Media is not available');
      return;
    };
    
    this.createAudio(); 
  }
  
  private createAudio() {
    this.audio = new Media(this.src, () => {
       console.log('Finished playback');
       this.stopTimer();
       this.isFinished = true;  
       this.destroy();  // TODO add parameter to control whether to release audio on stop or finished
    }, (err) => {
      console.log(`Audio error => track ${this.src}`, err);   
    }, (status) => {
      switch (status) {
        case Media.MEDIA_STARTING:
          console.log(`Loaded track ${this.src}`);
          this._hasLoaded = true;
          break;
        case Media.MEDIA_RUNNING:
          console.log(`Playing track ${this.src}`);
          this.isPlaying = true;
          this._isLoading = false;          
          break; 
        case Media.MEDIA_PAUSED:
          this.isPlaying = false;
          break
        case Media.MEDIA_STOPPED:
          this.isPlaying = false;
          break;
      }
    });  
  }
  
  private startTimer() {
    this._timer = setInterval(() => {  
      if (this._duration===undefined || this._duration < 0) {
        this._duration = Math.round(this.audio.getDuration()*100)/100;
      }  
      
      this.audio.getCurrentPosition((position) => {
            if (position > -1) {
              this._progress = Math.round(position*100)/100;
              this._completed = this._duration > 0 ? Math.round(this._progress / this._duration * 100)/100 : 0; 
            }
        }, (e) => {
            console.log("Error getting position", e);
        }
      );
    }, 1000);  
  }
  
  private stopTimer() {
    clearInterval(this._timer);
  }
  
  /** public members */

  /**
 * Gets the track id
 * 
 * @property id
 * @type {number}
 */
  public get id() : number {
    return this._id;
  }
  
  /**
 * Sets the track id
 * 
 * @property id
 */
  public set id(v : number) {
    this._id = v;
  }
  
  /**
 * Gets the track duration, or -1 if it cannot be determined
 * 
 * @property duration
 * @readonly
 * @type {number}
 */
  public get duration() : number {
    return this._duration;
  }
  
  /**
 * Gets current track time (progress)
 * 
 * @property progress
 * @readonly
 * @type {number}
 */
  public get progress() : number {
    return this._progress;
  } 
  
  /**
 * Gets current track progress as a percentage
 * 
 * @property completed
 * @readonly
 * @type {number}
 */
  public get completed() : number {
    return this._completed;
  }

/**
 * Gets any errors logged by HTML5 audio
 *
 * @property error 
 * @readonly
 * @type {MediaError}
 */
  public get error() : MediaError {
    return this.audio.error;
  }
  
  /**
 * Gets a boolean value indicating whether the current source can be played
 * 
 * @property canPlay
 * @readonly
 * @type {boolean}
 */
  public get canPlay() : boolean {
    return true;
  }
  
  /**
 * Gets a boolean value indicating whether the track is in loading state
 * 
 * @property isLoading
 * @readonly
 * @type {boolean}
 */
  public get isLoading() : boolean {
    return this._isLoading;
  }
  
  /**
 * Gets a boolean value indicating whether the track has finished loading
 *
 * @property hadLoaded 
 * @readonly
 * @type {boolean}
 */
  public get hasLoaded() : boolean {
    return this._hasLoaded;
  }
  
  /**
 * Plays current track
 * 
 * @method play
 */
  play() {
    if (!this.audio) {
      this.createAudio(); 
    }
    
    if (!this._hasLoaded) {
      console.log(`Loading track ${this.src}`);
      this._isLoading = true;
    }
    
    this.audio.play();
    this.startTimer();
  }
  
  /**
 * Pauses current track
 *
 * @method pause 
 */
  pause() {
    if (!this.isPlaying) return;
    console.log(`Pausing track ${this.src}`);
    this.audio.pause();
    this.stopTimer();  
  }
  
  /**
 * Stops current track and releases audio
 *
 * @method stop 
 */
  stop() {
    this.audio.stop();  // calls Media onSuccess callback
  }
  
  /**
 * Seeks to a new position within the track
 *
 * @method seekTo 
 * @param {number} time the new position (milliseconds) to seek to
 */
  seekTo(time: number) {
    // Cordova Media reports duration and progress as seconds, so we need to multiply by 1000
    this.audio.seekTo(time*1000);
  }
  
  /**
   * Releases audio resources
   * 
   * @method destroy
   */
  destroy() {
    this.audio.release();  
    console.log(`Released track ${this.src}`);
  }
}