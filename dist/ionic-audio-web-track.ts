import {IAudioTrack} from './ionic-audio-interfaces'; 
import {Injectable, Optional} from '@angular/core';

declare let window;
window.AudioContext = window['AudioContext'] || window['webkitAudioContext'];

/**
 * Creates an HTML5 audio track
 * 
 * @export
 * @class WebAudioTrack
 * @constructor
 * @implements {IAudioTrack}
 */
@Injectable()
export class WebAudioTrack implements IAudioTrack {
  private audio: HTMLAudioElement;
  public isPlaying: boolean = false;
  public isFinished: boolean = false;
  private _progress: number = 0;
  private _completed: number = 0;
  private _duration: number;
  private _id: number;
  private _isLoading: boolean;
  private _hasLoaded: boolean;
  constructor(public src: string, @Optional() public preload: string = 'none') {
    // audio context not needed for now
    // @Optional() private ctx: AudioContext = undefined
    // this.ctx = this.ctx || new AudioContext();
    
    this.createAudio(); 
  }
  
  private createAudio() {
    this.audio = new Audio();
    this.audio.src = this.src;
    this.audio.preload = this.preload;
    //this.audio.controls = true;
    //this.audio.autoplay = false;
    
    this.audio.addEventListener("timeupdate", (e) => { this.onTimeUpdate(e); }, false);
    
    this.audio.addEventListener("error", (err) => {
      console.log(`Audio error => track ${this.src}`, err);
      this.isPlaying = false;
    }, false);
    
    this.audio.addEventListener("canplay", () => {
      console.log(`Loaded track ${this.src}`);
      this._isLoading = false;
      this._hasLoaded = true;
    }, false);
    
    this.audio.addEventListener("playing", () => {
      console.log(`Playing track ${this.src}`);
      this.isFinished = false;
      this.isPlaying = true;
    }, false);
    
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.isFinished = true;
      console.log('Finished playback');
    }, false);
    
    this.audio.addEventListener("durationchange", (e:any) => {    
      this._duration = e.target.duration;
    }, false);  
  }
  
  private onTimeUpdate(e: Event) {
    if (this.isPlaying && this.audio.currentTime > 0) {
      this._progress = this.audio.currentTime;
      this._completed = this.audio.duration > 0 ? Math.trunc (this.audio.currentTime / this.audio.duration * 100)/100 : 0;
    }  
  }
  
  static formatTime(value:number) {
    let s = Math.trunc(value % 60);
    let m = Math.trunc((value / 60) % 60);
    let h = Math.trunc(((value / 60) / 60) % 60);  
    return h > 0 ? `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}` : `${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
  } 
  
  
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
    let format = `audio/${this.audio.src.substr(this.audio.src.lastIndexOf('.')+1)}`;
    return this.audio && this.audio.canPlayType(format) != '';
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
    
    //var source = this.ctx.createMediaElementSource(this.audio);  
    //source.connect(this.ctx.destination);
    this.audio.play();
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
    this.isPlaying = false;
  } 
  
  /**
   * Stops current track and releases audio
   *
   * @method stop 
   */
  stop() {
    if (!this.audio) return;
    this.pause();
    this.audio.removeEventListener("timeupdate", (e) => { this.onTimeUpdate(e); });
    this.isFinished = true;
    this.destroy();
  }
  
  
  /**
   * Seeks to a new position within the track
   *
   * @method seekTo 
   * @param {number} time the new position to seek to
   */
  seekTo(time: number) {
    this.audio.currentTime = time;  
  }
  
  /**
   * Releases audio resources
   * 
   * @method destroy
   */
  destroy() {
    this.audio = undefined;  
    console.log(`Released track ${this.src}`);
  }
}