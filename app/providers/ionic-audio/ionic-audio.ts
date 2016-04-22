
/**
 * An audio player for Ionic 2 and Angular 2
 *
 * @module ionic-audio
 */

import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio.d.ts'; 
import {Component, Directive, DoCheck, SimpleChange, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {Http} from 'angular2/http';
import {Icon} from 'ionic-angular';
import {DragGesture} from 'ionic-angular/gestures/drag-gesture';

declare let webkitAudioContext;
declare let Media: any;

export * from './ionic-audio.d.ts';

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
    return window.cordova && window.hasOwnProperty('Media') ? new CordovaAudioProvider() : new WebAudioProvider();
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
  
  constructor() {
    super();
    console.log('Using WebAudioProvider');
  }
  
  create(track: ITrackConstraint) {
    let audioTrack = new AudioTrack(track.src, track.preload);  
    Object.assign(audioTrack, track);
    let trackId = WebAudioProvider.tracks.push(audioTrack);
    audioTrack.id = trackId-1; 
    return audioTrack;
  }
  
}

/**
 * Creates a Cordova audio provider
 * 
 * @export
 * @class CordovaAudioProvider
 * @constructor
 * @extends {AudioProvider}
 */
@Injectable()
export class CordovaAudioProvider extends AudioProvider {
  
  constructor() {
    console.log('Using CordovaAudioProvider');
    super();
  }
  
  create(track: ITrackConstraint) {
    let audioTrack = new CordovaAudioTrack(track.src);  
    Object.assign(audioTrack, track);
    let trackId = CordovaAudioProvider.tracks.push(audioTrack);
    audioTrack.id = trackId-1; 
    return audioTrack;
  }
  
}

/**
 * Creates an HTML5 audio track
 * 
 * @export
 * @class AudioTrack
 * @constructor
 * @implements {IAudioTrack}
 */
@Injectable()
export class AudioTrack implements IAudioTrack {
  private audio: HTMLAudioElement;
  public isPlaying: boolean = false;
  public isFinished: boolean = false;
  private _progress: number;
  private _completed: number;
  private _duration: number;
  private _id: number;
  private _isLoading: boolean;
  private _hasLoaded: boolean;
  constructor(public src: string, @Optional() public preload: string = 'none', @Optional() private ctx: AudioContext = new (AudioContext || webkitAudioContext)()) {
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
   * Stops current track
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
   * Destroys this track instance
   * 
   * @method destroy
   */
  destroy() {
    this.audio = undefined;  
    console.log(`Released track ${this.src}`);
  }
}

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
  private _progress: number;
  private _completed: number;
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
    this.audio = new Media(src, () => {
       console.log('Playback finished')  
    }, (err) => {
      console.log('Error', err)    
    }, (status) => {
      console.log('Status change', status)
    });
  }
  
  private startTimer() {
    this._timer = setInterval(() => {  
      if (this._duration===undefined || this._duration < 0) {
        this._duration = Math.round(this.audio.getDuration()*100)/100;
        console.log(this._duration + " sec");
      }  
      
      this.audio.getCurrentPosition((position) => {
            if (position > -1) {
              this._progress = Math.round(position*100)/100;
              this._completed = this._duration > 0 ? Math.round(this._progress / this._duration * 100)/100 : 0; 
              console.log((position) + " sec", 'Completed', this._completed);
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
    this.audio.play();
    this.startTimer();
  }
  
  /**
 * Pauses current track
 *
 * @method pause 
 */
  pause() {
    this.audio.pause();
    this.stopTimer();  
  }
  
  /**
 * Stops current track
 *
 * @method stop 
 */
  stop() {
    this.audio.stop();
    this.stopTimer();  
  }
  
  /**
 * Seeks to a new position within the track
 *
 * @method seekTo 
 * @param {number} time the new position to seek to
 */
  seekTo(time: number) {
    this.audio.seekTo(time);
  }
  
  /**
   * Destroys this track instance
   * 
   * @method destroy
   */
  destroy() {
    this.audio.release();  
  }
}

/**
 * # ```<audio-track>``` 
 * 
 * Creates a top level audio-track component
 * 
 * ## Usage
 * 
 * ````
 *   <audio-track #audio [track]="myTrack" (onFinish)="onTrackFinished($event)">
 *   ...
 *   </audio-track>
 * ````
 * @element audio-track
 * @export
 * @class AudioTrackComponent
 */
@Component({
    selector: 'audio-track',
    template: '<ng-content></ng-content>',
    providers: []
})
export class AudioTrackComponent { 
  /**
   * Input property containing a JSON object with at least a src property
   * ````
   *   this.myTrack = {
   *     src: 'https://www,mysite.com/myTrack.mp3',
   *     artist: 'Artist name',
   *     title: '...',
   *     art: 'img/artist.jpg',
   *     preload: 'metadata' // tell the plugin to preload metadata such as duration for this track
   *   };
   * ````
   * @property track
   * @type {ITrackConstraint}
   */
  @Input() track: ITrackConstraint;
  
  /**
   * Output property expects an event handler to be notified whenever playback finishes
   * 
   * @property onFinish
   * @type {EventEmitter}
   */
  @Output() onFinish = new EventEmitter<ITrackConstraint>();
  
  private _isFinished: boolean = false;
  private _audioTrack: IAudioTrack;
  
  constructor(private _audioProvider: AudioProvider) {}
  
  ngOnInit() {
    if (!(this.track instanceof AudioTrack)) {
      this._audioTrack = this._audioProvider.create(this.track); 
    } else {
      Object.assign(this._audioTrack, this.track);
      this._audioProvider.add(this._audioTrack);
    }
    
    // update input track parameter with track is so we pass it to WebAudioProvider if needed
    this.track.id = this._audioTrack.id; 
  }
  
  play() {    
    this._audioTrack.play();
    this._audioProvider.current = this._audioTrack.id;
  }
  
  pause() {
    this._audioTrack.pause();
    this._audioProvider.current = undefined;
  }
  
  toggle() {
    if (this._audioTrack.isPlaying) {
      this.pause();
    } else {
      this.play();
    }  
  }
  
  seekTo(time:number) {
    this._audioTrack.seekTo(time);  
  }
  
  
  public get id() : number {
    return this._audioTrack.id;
  }
  
  public get art() : string {
    return this.track.art;
  }
  
  
  public get artist() : string {
    return this.track.artist;
  }
  
  
  public get title() : string {
    return this.track.title;
  }
    
  public get progress() : number {
    return this._audioTrack.progress;
  }
      
  public get isPlaying() : boolean {
    return this._audioTrack.isPlaying;
  }
  
  public get duration() : number {
    return this._audioTrack.duration;
  }
  
  public get completed() : number {
    return this._audioTrack.completed;
  }
  
  public get canPlay() {
    return this._audioTrack.canPlay;
  }
  
  public get error() {
    return this._audioTrack.error;
  }
  
  public get isLoading() : boolean {
    return this._audioTrack.isLoading;
  }
  
  public get hasLoaded() : boolean {
    return this.hasLoaded;
  }
  
  ngDoCheck() {
    if(!Object.is(this._audioTrack.isFinished, this._isFinished)) {
      // some logic here to react to the change
      this._isFinished = this._audioTrack.isFinished;
      
      // track has stopped, trigger finish event
      if (this._isFinished) {
        this.onFinish.emit(this.track);       
      }
    }
  }
}

/**
 * # ```<audio-track-play>``` 
 * 
 * Renders a play/pause button that optionally displays a loading spinner
 * 
 * ## Usage
 * ````
 * <audio-track #audio [track]="myTrack" (onFinish)="onTrackFinished($event)">
 *  <ion-item>  
 *    <audio-track-play item-left [audioTrack]="audio"><ion-spinner></ion-spinner></audio-track-play>
 *    <h3>{{audio.title}}</h3>
 *  </ion-item>    
 * </audio-track>
 * ````
 * If placed within a ```<ion-thumnbail>``` component it will render as a semi-transparent button layover (see live demo). 
 * Passing a ```<ion-spinner>``` as a child element will display a loading spinner while loading.
 * 
 * ````
 * <audio-track #audio [track]="track" (onFinish)="onTrackFinished($event)">
 *   <ion-item>  
 *       <ion-thumbnail item-left>
 *         <img src="{{audio.art}}">
 *         <audio-track-play dark [audioTrack]="audio"><ion-spinner></ion-spinner></audio-track-play>  
 *       </ion-thumbnail>
 *       <p><strong>{{audio.title}}</strong></p>
 *   </ion-item>    
 * </audio-track>
 * ````
 * 
 * @element audio-track-play 
 * @parents audio-track
 * @export
 * @class AudioTrackPlayComponent
 */
@Component({
    selector: 'audio-track-play',
    template: `
    <button clear (click)="toggle($event)" [disabled]="audioTrack.error || audioTrack.isLoading">
      <ion-icon name="pause" *ngIf="audioTrack.isPlaying && !audioTrack.isLoading"></ion-icon>
      <ion-icon name="play" *ngIf="!audioTrack.isPlaying && !audioTrack.isLoading"></ion-icon>
      <ng-content *ngIf="audioTrack.isLoading && !audioTrack.error"></ng-content>
    </button>
    `,
    directives: [Icon]
})
export class AudioTrackPlayComponent {
  private _isPlaying: boolean = false;
  private _isLoading: boolean = false;
  
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   * 
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() audioTrack: IAudioTrack;
  
  /**
   * Renders the component using the light theme
   * 
   * @property @Input() light
   * @type {boolean}
   */
  @Input()
  set light(val: boolean) {
    this.el.nativeElement.firstElementChild.classList.add('light');
  }
  
  /**
   * Renders the component using the dark theme
   * 
   * @property @Input() dark
   * @type {boolean}
   */
  @Input()
  set dark(val: boolean) {
    this.el.nativeElement.firstElementChild.classList.add('dark'); 
  }
  
  constructor(private el: ElementRef) {}
  
  toggle(){    
    if (this.audioTrack.isPlaying) {
      this.audioTrack.pause()
    } else {
      this.audioTrack.play()
    } 
  }
}

/**
 * A pipe to convert milliseconds to a string representation
 * 
 * @export
 * @class AudioTimePipe
 * @implements {PipeTransform}
 */
@Pipe({name: 'audioTime'})
export class AudioTimePipe implements PipeTransform {
  
  /**
   * Transforms milliseconds to hh:mm:ss
   * 
   * @method transform
   * @param {number} [value] The milliseconds
   * @return {string} hh:mm:ss
   */
  transform(value?:number) : string {    
    if (!value) return '';
    let s = Math.trunc(value % 60);
    let m = Math.trunc((value / 60) % 60);
    let h = Math.trunc(((value / 60) / 60) % 60);  
    return h > 0 ? `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}` : `${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
  }
}

/**
 * # ```<audio-track-progress>``` 
 * 
 * Renders a timer component displaying track progress and duration 
 * 
 * ## Usage
 * ````
 * <audio-track-progress [audioTrack]="track"></audio-track-progress>
 * ````
 * 
 * @element audio-track-progress
 * @parents audio-track
 * @export
 * @class AudioTrackProgressComponent
 */
@Component({
    selector: 'audio-track-progress',
    template: '<em *ngIf="audioTrack.completed > 0">{{audioTrack.progress | audioTime}} / </em><em>{{audioTrack.duration | audioTime}}</em>',
    pipes: [AudioTimePipe]
})
export class AudioTrackProgressComponent {
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   * 
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() audioTrack: IAudioTrack;  
}

/**
 * # ```<audio-track-progress-bar>```
 * 
 * Renders a progress bar with optional timer, duration and progress indicator that allow seeking
 * 
 * ## Usage
 * ````
 *  <audio-track-progress-bar dark duration progress [audioTrack]="audio"></audio-track-progress-bar>
 * ````
 * 
 * @element audio-track-progress-bar
 * @parents audio-track
 * @export
 * @class AudioTrackProgressBarComponent
 */
@Component({
    selector: 'audio-track-progress-bar',
    template: `<time *ngIf="_showProgress">{{audioTrack.progress | audioTime}}</time>
    <input type="range" min="0" max="100" step="1" [(ngModel)]="_range" [ngStyle]="{'visibility': _completed > 0 ? 'visible' : 'hidden'}">
    <time *ngIf="_showDuration">{{audioTrack.duration | audioTime}}</time>
    `,
    pipes: [AudioTimePipe],
    directives: [NgStyle]
})
export class AudioTrackProgressBarComponent {
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   * 
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() audioTrack: IAudioTrack;
  
  private _completed: number = 0;
  private _range: number = 0;
  private _showDuration: boolean;
  private _showProgress: boolean;
  constructor(private el: ElementRef) { 
  }
  
  /**
   * Input property indicating whether to display track progress 
   * 
   * @property @Input() progress
   * @type {boolean}
   */
  @Input()
  public set progress(v : boolean) {
    this._showProgress = true;
  }
  
  /**
   * Input property indicating whether to display track duration 
   * 
   * @property @Input() duration
   * @type {boolean}
   */
  @Input()
  public set duration(v:  boolean) {
    this._showDuration = true;
  }
  
  /**
   * Renders the component using the light theme
   * 
   * @property @Input() light
   * @type {boolean}
   */
  @Input()
  set light(val: boolean) {
    this.el.nativeElement.querySelector("input").classList.add('light');
  }
  
  /**
   * Renders the component using the dark theme
   * 
   * @property @Input() dark
   * @type {boolean}
   */
  @Input()
  set dark(val: boolean) {
    this.el.nativeElement.querySelector("input").classList.add('dark'); 
  }
  
  ngOnInit() {
    this.el.nativeElement.querySelector("input").addEventListener("input", (e) => { 
      this.seekTo();
    }, false);
        
  }
  
  ngDoCheck() {
    if(this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this._completed)) {
      this._completed = this.audioTrack.completed; 
      this._range = Math.round(this._completed*100*100)/100;
    }
  }
  
  seekTo() {
    let seekTo: number = Math.round(this.audioTrack.duration*this._range)/100;
    this.audioTrack.seekTo(seekTo);   
  }
}

/*
@Component({
    selector: 'audio-track-progress-slider',
    template: ``,
    directives: [NgStyle]
})
export class AudioTrackProgressSliderComponent extends DragGesture {
  @Input() audioTrack: IAudioTrack;
  @Output() onSeek = new EventEmitter<any>();
  private _completed: number = 0;
  constructor(private el: ElementRef) { 
    super(el.nativeElement);
  }
  
  ngOnInit() {      
    super.listen();  
  }
  
  ngDoCheck() {
    if(this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this._completed)) {
      
    }
  }
  
  onDrag(ev) {
  // console.log(ev)
    return super.onDrag(ev);
  };
  onDragStart(ev)  {
  // console.log(ev);
    return super.onDragStart(ev);
  };         
  onDragEnd(ev) {
    this.onSeek.emit(ev);
    return super.onDragEnd(ev);
  };  
}
*/