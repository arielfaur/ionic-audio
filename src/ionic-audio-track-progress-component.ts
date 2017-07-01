import {IAudioTrack} from './ionic-audio-interfaces'; 
import {Component, ElementRef, Renderer, Input } from '@angular/core';

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
    template: '<em *ngIf="audioTrack.duration > 0">{{audioTrack.progress | audioTime}} / </em><em>{{audioTrack.duration | audioTime}}</em>'
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
 * Renders a progress bar with optional timer, duration and progress indicator
 * 
 * ## Usage
 * ````
 *  <audio-track-progress-bar duration progress [audioTrack]="audio"></audio-track-progress-bar>
 * ````
 * 
 * @element audio-track-progress-bar
 * @parents audio-track
 * @export
 * @class AudioTrackProgressBarComponent
 */
@Component({
    selector: 'audio-track-progress-bar',
    template: `
    <time *ngIf="_showProgress">{{audioTrack.progress | audioTime}}</time>
    <input type="range" #seeker min="0" [max]="audioTrack.duration" step="any" [value]="audioTrack.progress" (change)="seekTo(seeker.value)">
    <time *ngIf="_showDuration">{{audioTrack.duration | audioTime}}</time>
    `
})
export class AudioTrackProgressBarComponent {
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   * 
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() audioTrack: IAudioTrack;
  
  private _showDuration: boolean;
  private _showProgress: boolean;
  
  constructor(private el: ElementRef, private renderer: Renderer) { 
  }
  
  /**
   * Input property indicating whether to display track progress 
   * 
   * @property @Input() progress
   * @type {boolean}
   */
  @Input()
  public set progress(value : boolean) {
    this._showProgress = true;
  }

  public get progress() {
    return this._showProgress;
  }
  
  /**
   * Input property indicating whether to display track duration 
   * 
   * @property @Input() duration
   * @type {boolean}
   */
  @Input()
  public set duration(value:  boolean) {
    this._showDuration = true;
  } 

  public get duration() {
    return this._showDuration;
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '100%');       
  }
    
  seekTo(value: any) {
    console.log("Seeking to", value);
    if (!Number.isNaN(value)) this.audioTrack.seekTo(value);     
  }
}