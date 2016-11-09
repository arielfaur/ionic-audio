import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 
import {AudioTimePipe} from './ionic-audio-time-pipe';

import {Component, Directive, DoCheck, SimpleChange, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import {NgStyle} from '@angular/common';

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
    <ion-range [(ngModel)]="_range" min="0" max="100" (ionChange)="seekTo()" name="progress" ngDefaultControl>
      <time *ngIf="_showProgress" range-left>{{audioTrack.progress | audioTime}}</time>
      <time *ngIf="_showDuration" range-right>{{audioTrack.duration | audioTime}}</time>
    </ion-range>
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
  
  private _completed: number = 0;
  private _range: number = 0;
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
  
  ngOnInit() {
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '100%');       
  }
  
  ngDoCheck() {
    if(this.audioTrack.completed > 0 && !Object.is(this.audioTrack.completed, this._completed)) {
      this._completed = this.audioTrack.completed; 
      this._range = Math.round(this._completed*100*100)/100;
    }
  }
  
  seekTo() {
    let seekTo: number = Math.round(this.audioTrack.duration*this._range)/100;
    if (!Number.isNaN(seekTo)) this.audioTrack.seekTo(seekTo);     
  }
}