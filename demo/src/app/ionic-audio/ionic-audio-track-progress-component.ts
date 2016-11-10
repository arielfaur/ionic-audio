import {IAudioTrack} from './ionic-audio-interfaces'; 
import {Component, DoCheck,  ElementRef, Renderer, Input } from '@angular/core';

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
    <ion-range [(ngModel)]="range" min="0" max="100" (ionChange)="seekTo()" name="progress" ngDefaultControl>
      <time *ngIf="showProgress" range-left>{{audioTrack.progress | audioTime}}</time>
      <time *ngIf="showDuration" range-right>{{audioTrack.duration | audioTime}}</time>
    </ion-range>
    `
})
export class AudioTrackProgressBarComponent implements DoCheck {
  /**
   * The AudioTrackComponent parent instance created by ```<audio-track>```
   * 
   * @property @Input() audioTrack
   * @type {IAudioTrack}
   */
  @Input() audioTrack: IAudioTrack;
  
  public completed: number = 0;
  public range: number = 0;
  public showDuration: boolean;
  public showProgress: boolean;
  constructor(private el: ElementRef, private renderer: Renderer) { 
  }
  
  /**
   * Input property indicating whether to display track progress 
   * 
   * @property @Input() progress
   * @type {boolean}
   */
  @Input()
  public set progress(v : boolean) {
    this.showProgress = true;
  }
  
  /**
   * Input property indicating whether to display track duration 
   * 
   * @property @Input() duration
   * @type {boolean}
   */
  @Input()
  public set duration(v:  boolean) {
    this.showDuration = true;
  }
  
  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '100%');       
  }
  
  ngDoCheck() {
    if(this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this.completed)) {
      this.completed = this.audioTrack.completed; 
      this.range = Math.round(this.completed*100*100)/100;
    }
  }
  
  seekTo() {
    let seekTo: number = Math.round(this.audioTrack.duration*this.range)/100;
    if (!Number.isNaN(seekTo)) this.audioTrack.seekTo(seekTo);     
  }
}