import {IAudioProvider, ITrackConstraint, IAudioTrack} from './ionic-audio-interfaces'; 

import {Component, Directive, DoCheck, SimpleChange, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from 'angular2/core';
import {Icon} from 'ionic-angular';

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