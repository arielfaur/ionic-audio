import { Directive, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { AudioProvider } from './ionic-audio-providers'; 
import { ITrackConstraint } from './ionic-audio-interfaces'; 

/**
 * Generated class for the AudioPlaylistItemDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[audio-playlist-item]' // Attribute selector
})
export class AudioPlaylistItemDirective {
  @Input() track: ITrackConstraint;
  @Input() currentTrack: ITrackConstraint;
  @Output() currentTrackChange = new EventEmitter<ITrackConstraint>();

  private static _currentIndex: number = -1;
  private static _tracklist: ITrackConstraint[] = [];
  private _index: number;

  constructor(private _audioProvider: AudioProvider) {
  }

  ngOnInit() {
      this._index = AudioPlaylistItemDirective._tracklist.push(this.track) - 1;
  }

  @HostListener('click') onClick() {
    this._play();
  }

  next() {
    if (AudioPlaylistItemDirective._currentIndex > -1 && AudioPlaylistItemDirective._currentIndex < AudioPlaylistItemDirective._tracklist.length - 1) {
      this._play(++AudioPlaylistItemDirective._currentIndex);
    }
  }

  get currentIndex() {
    return AudioPlaylistItemDirective._currentIndex;
  }

  private _play(index?: number) {
    index = index || this._index;

    console.log('Playing', index);
    
    AudioPlaylistItemDirective._currentIndex = index;
    
    this.currentTrack = AudioPlaylistItemDirective._tracklist[index];
    this.currentTrackChange.emit(this.currentTrack);
    
  }
}
