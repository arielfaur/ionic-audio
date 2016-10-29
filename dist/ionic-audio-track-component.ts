import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 
import {AudioProvider, WebAudioProvider, CordovaMediaProvider} from './ionic-audio-providers'; 
import {WebAudioTrack} from './ionic-audio-web-track'; 
import {CordovaAudioTrack} from './ionic-audio-cordova-track'; 

import {Component, Directive, DoCheck, SimpleChange, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';


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
    if(this._audioProvider.current !=undefined) {
      this._audioProvider.pause(this._audioProvider.current);
      this._audioProvider.current = undefined;
    }
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