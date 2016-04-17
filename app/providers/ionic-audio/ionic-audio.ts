import {Component, Directive, DoCheck, SimpleChange, EventEmitter, ElementRef, Renderer, Output, Input, Injectable, Inject, Optional, Pipe, PipeTransform} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {Http} from 'angular2/http';
import {Icon} from 'ionic-angular';
import {DragGesture} from 'ionic-angular/gestures/drag-gesture';

declare var webkitAudioContext;

export interface IAudioProvider {
  current: number;
  
  add(track: IAudioTrack);
  play(index: number);
  pause(index?: number);
  stop(index?: number);
}

@Injectable()
export class WebAudioProvider implements IAudioProvider {
  static tracks: IAudioTrack[] = [];
  private _current: number;
  
  constructor() {
  }
  
  static createAudio(track: ITrackConstraint) {
    let audioTrack = new AudioTrack(track.src);  
    Object.assign(audioTrack, track);
    let trackId = WebAudioProvider.tracks.push(audioTrack);
    audioTrack.id = trackId-1; 
    return audioTrack;
  }
  
  add(audioTrack: IAudioTrack) {
    WebAudioProvider.tracks.push(audioTrack);  
  };
  
  play(index: number) {
    if (index===undefined || index > WebAudioProvider.tracks.length-1) return;
    this._current = index;
    WebAudioProvider.tracks[index].play();  
  };
  
  pause(index?: number) {
    if (this._current===undefined || index > WebAudioProvider.tracks.length-1) return;
    index = index || this._current;
    WebAudioProvider.tracks[index].pause();
  };
  
  stop(index?: number) {
    if (this._current===undefined || index > WebAudioProvider.tracks.length-1) return;
    index = index || this._current;
    WebAudioProvider.tracks[index].stop();
    this._current = undefined;
  };
    
  public get current() : number {
    return this._current;
  }
  
  public set current(v : number) {
    this._current = v;
  }
  
}

export interface ITrackConstraint {
  id?:number;
  src: string;
  title?: string;
  artist?: string;
  art?: string;  
}

export interface IAudioTrack extends ITrackConstraint {
  src: string;
  id: number;
  isPlaying: boolean; 
  isFinished: boolean;
  duration: number;
  progress: number;
  completed: number;
  canPlay:  boolean;
  error: MediaError;
  
  play();
  pause();
  stop();
  seekTo(time: number);
  destroy();
}

@Injectable()
export class AudioTrack implements IAudioTrack {
  private audio: HTMLAudioElement;
  public isPlaying: boolean = false;
  public isFinished: boolean = false;
  private _progress: number;
  private _completed: number;
  private _duration: number;
  private _id: number;
  constructor(public src: string, @Optional() private ctx: AudioContext = new (AudioContext || webkitAudioContext)()) {
    this.createAudio(); 
   
    this.audio.addEventListener("timeupdate", (e) => { this.onTimeUpdate(e); }, false);
    
    this.audio.addEventListener("error", (err) => {
			 console.log(`Audio error => track ${src}`, err);
		}, false);
    
    this.audio.addEventListener("playing", () => {
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
  
  private createAudio() {
    this.audio = new Audio();
    this.audio.src = this.src;
    //this.audio.controls = true;
    //this.audio.autoplay = false;  
  }
  
  private onTimeUpdate(e: Event) {
    if (this.isPlaying && this.audio.currentTime > 0) {
      this._progress = this.audio.currentTime;
      this._completed = this.audio.duration > 0 ? this.audio.currentTime / this.audio.duration : 0;
    }  
  }
   
  static formatTime(value:number) {
    let s = Math.trunc(value % 60);
    let m = Math.trunc((value / 60) % 60);
    let h = Math.trunc(((value / 60) / 60) % 60);  
    return h > 0 ? `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}` : `${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
  } 
  
  
  public get id() : number {
    return this._id;
  }
  
  public set id(v : number) {
    this._id = v;
  }
  
  public get duration() : number {
    return this._duration;
  }
   
  public get progress() : number {
    return this._progress;
  }
   
  public get completed() : number {
    return this._completed;
  }
 
  public get error() : MediaError {
    return this.audio.error;
  }
  
  public get canPlay() : boolean {
    let format = `audio/${this.audio.src.substr(this.audio.src.lastIndexOf('.')+1)}`;
    return this.audio && this.audio.canPlayType(format) != '';
  }
  
  play() {
    if (!this.audio) {
      this.createAudio(); 
    }
    console.log(`Playing track ${this.src}`);
    //var source = this.ctx.createMediaElementSource(this.audio);  
    //source.connect(this.ctx.destination);
    this.audio.play();
  } 
  
  pause() {
    if (!this.isPlaying) return;
    console.log(`Pausing track ${this.src}`);
    this.audio.pause();
    this.isPlaying = false;
  } 
  
  stop() {
    if (!this.audio) return;
    this.pause();
    this.audio.removeEventListener("timeupdate", (e) => { this.onTimeUpdate(e); });
    this.isFinished = true;
    this.destroy();
  }
  
  seekTo(time: number) {
    this.audio.currentTime = time;  
  }
  
  destroy() {
    this.audio = undefined;  
    console.log(`Released track ${this.src}`);
  }
}

@Component({
    selector: 'audio-track',
    template: '<ng-content></ng-content>',
    providers: []
})
export class AudioTrackComponent { 
  @Input() track: ITrackConstraint;
  @Output() onFinish = new EventEmitter<ITrackConstraint>();
  private _isFinished: boolean = false;
  private _audioTrack: IAudioTrack;
  
  constructor(private _audioProvider: WebAudioProvider) {}
  
  ngOnInit() {
    if (!(this.track instanceof AudioTrack)) {
      this._audioTrack = WebAudioProvider.createAudio(this.track); //new AudioTrack(this.track.src) 
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

@Component({
    selector: 'audio-track-play',
    template: '<button clear (click)="toggle($event)" [disabled]="audioTrack.error"><ion-icon name="pause" *ngIf="_isPlaying"></ion-icon><ion-icon name="play" *ngIf="!_isPlaying"></ion-icon></button>',
    directives: [Icon]
})
export class AudioTrackPlayComponent {
  private _isPlaying: boolean = false;
  @Input() audioTrack: IAudioTrack;
  
  @Input()
  set light(val: boolean) {
    this.el.nativeElement.firstElementChild.classList.add('light');
  }
  
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
  
  ngDoCheck() {
    if(!Object.is(this.audioTrack.isPlaying, this._isPlaying)) {
      // some logic here to react to the change
      this._isPlaying = this.audioTrack.isPlaying;
    }
  }
}

@Pipe({name: 'audioTime'})
export class AudioTimePipe implements PipeTransform {
  transform(value?:number) : string {    
    if (!value) return '';
    let s = Math.trunc(value % 60);
    let m = Math.trunc((value / 60) % 60);
    let h = Math.trunc(((value / 60) / 60) % 60);  
    return h > 0 ? `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}` : `${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
  }
}

@Component({
    selector: 'audio-track-progress',
    template: '<em *ngIf="audioTrack.completed > 0">{{audioTrack.progress | audioTime}} / </em><em>{{audioTrack.duration | audioTime}}</em>',
    pipes: [AudioTimePipe]
})
export class AudioTrackProgressComponent {
  @Input() audioTrack: IAudioTrack;  
}


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

@Component({
    selector: 'audio-track-progress-bar',
    template: `<time *ngIf="_showProgress">{{audioTrack.progress | audioTime}}</time>
    <input type="range" min="0" max="100" step="1" [(ngModel)]="_range" [ngStyle]="{'visibility': _completed > 0 ? 'visible' : 'hidden'}">
    <time *ngIf="_showDuration">{{audioTrack.duration | audioTime}}</time>
    `,
    pipes: [AudioTimePipe],
    directives: [NgStyle, AudioTrackProgressSliderComponent]
})
export class AudioTrackProgressBarComponent {
  @Input() audioTrack: IAudioTrack;
  private _completed: number = 0;
  private _range: number = 0;
  private _showDuration: boolean;
  private _showProgress: boolean;
  constructor(private el: ElementRef) { 
  }
  
  @Input()
  public set progress(v : boolean) {
    this._showProgress = true;
  }
  
  @Input()
  public set duration(v:  boolean) {
    this._showDuration = true;
  }
  
  @Input()
  set light(val: boolean) {
    this.el.nativeElement.querySelector("input").classList.add('light');
  }
  
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
@Injectable()
export class IonicAudio {
  private data: any;
  
  constructor() {
    this.http = http;
    this.data = null;
  }

  load() {
    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get('path/to/data.json')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
*/