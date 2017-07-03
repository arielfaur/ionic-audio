import {ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 
import {AudioProvider} from './ionic-audio-providers'; 
import {WebAudioTrack} from './ionic-audio-web-track'; 
import {CordovaAudioTrack} from './ionic-audio-cordova-track'; 

import {Component, DoCheck, OnChanges, SimpleChanges, EventEmitter, Output, Input} from '@angular/core';


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
    template: '<ng-content></ng-content>'
})
export class AudioTrackComponent implements OnChanges, DoCheck { 
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
  
  private _audioTrack: IAudioTrack;
  
  constructor(private _audioProvider: AudioProvider) {}
  
  ngOnInit() {
    if (!this.track) return;

    if (!(this.track instanceof WebAudioTrack) && !(this.track instanceof CordovaAudioTrack)) {
      this._audioTrack = this._audioProvider.create(this.track); 
    } else {
      Object.assign(this._audioTrack, this.track);
      this._audioProvider.add(this._audioTrack);
    }
    
    // update input track parameter with track is so we pass it to WebAudioProvider if needed
    this.track.id = this._audioTrack.id; 
  }
  
  play() {    
    if (!this._audioTrack) return;

    this._audioTrack.play();
    this._audioProvider.current = this._audioTrack.id;
  }
  
  pause() {
    if (!this._audioTrack) return;

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
    if (!this._audioTrack) return;

    this._audioTrack.seekTo(time);  
  }
  
  
  public get id() : number {
    return this._audioTrack ? this._audioTrack.id : -1;
  }
  
  public get art() : string {
    return this.track ? this.track.art : undefined;
  }
  
  
  public get artist() : string {
    return this.track ? this.track.artist : undefined;
  }
  
  
  public get title() : string {
    return this.track ? this.track.title : undefined;
  }
    
  public get progress() : number {
    return this._audioTrack ? this._audioTrack.progress : 0;
  }
      
  public get isPlaying() : boolean {
    return this._audioTrack && this._audioTrack.isPlaying;
  }

  public get isFinished() : boolean {
    return this._audioTrack && this._audioTrack.isFinished;
  }
  
  public get duration() : number {
    return this._audioTrack ? this._audioTrack.duration : 0;
  }
  
  public get completed() : number {
    return this._audioTrack ? this._audioTrack.completed : 0;
  }
  
  public get canPlay() {
    return this._audioTrack && this._audioTrack.canPlay;
  }
  
  public get error() {
    return this._audioTrack ? this._audioTrack.error : undefined;
  }
  
  public get isLoading() : boolean {
    return this._audioTrack && this._audioTrack.isLoading;
  }
  
  public get hasLoaded() : boolean {
    return this._audioTrack && this._audioTrack.hasLoaded;
  }
  
  ngDoCheck() {
    // track has stopped, trigger finish event
    if (this._audioTrack && this._audioTrack.isFinished) {
      this.onFinish.emit(this.track);       
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("ngOnChanges", changes);
    if (changes.track.firstChange) return;

    if (this._audioTrack && this._audioTrack.isPlaying) this._audioTrack.stop();
    this._audioTrack =  this._audioProvider.replace(changes.track.previousValue, changes.track.currentValue);

    console.log("ngOnChanges -> new audio track", this._audioTrack);
    this._audioTrack.play();
  }
}