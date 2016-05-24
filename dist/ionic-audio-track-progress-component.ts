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