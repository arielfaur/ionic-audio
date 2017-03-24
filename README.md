# Ionic Audio for Ionic 2

An audio player plugin for Ionic that works out of the box in the browser and device using an underlying audio provider depending on the environment. When running inside the browser the plugin will default to a Web Audio provider, whereas on a device it will switch to Cordova Media if cordova-plugin-media is available, otherwise falls back to web audio.

## API Docs

[API](http://arielfaur.github.io/ionic-audio/2.0/docs/modules/ionic-audio.html)

## Demo

[Demo](http://arielfaur.github.io/ionic-audio-example/)

## Installation

Make sure you have Ionic and Angular installed.

```
npm install --save ionic-audio
```

**For Ionic 2 version 2.0.0 to 2.1.0:**
```
npm install --save ionic-audio@2.3.4
```


```typescript
import { IonicAudioModule } from 'ionic-audio';

@NgModule({
  imports: [
    IonicAudioModule.forRoot()
  ]
})
export class AppModule {}
```

## Usage

**Import and inject `AudioProvider` where needed (optional):**

```typescript
import {Component, Provider} from '@angular/core';
import { AudioProvider } from 'ionic-audio';

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {
  myTracks: any[];
  allTracks: any[];
   
  constructor(private _audioProvider: AudioProvider) { 
    // plugin won't preload data by default, unless preload property is defined within json object - defaults to 'none'
    this.myTracks = [{
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Why Georgia',
      art: 'img/johnmayer.jpg',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
    },
    {
      src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t30-MP3-V0.mp3',
      artist: 'John Mayer',
      title: 'Who Says',
      art: 'img/johnmayer.jpg',
      preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
    }];
  }
  
  ngAfterContentInit() {     
    // get all tracks managed by AudioProvider so we can control playback via the API
    this.allTracks = this._audioProvider.tracks; 
  }
  
  playSelectedTrack() {
    // use AudioProvider to control selected track 
    this._audioProvider.play(this.selectedTrack);
  }
  
  pauseSelectedTrack() {
     // use AudioProvider to control selected track 
     this._audioProvider.pause(this.selectedTrack);
  }
         
  onTrackFinished(track: any) {
    console.log('Track finished', track)
  } 
}
```

**Add components to views:**

```html
<ion-list>
  <audio-track #audio *ngFor="let track of myTracks"  [track]="track" (onFinish)="onTrackFinished($event)">
    <ion-item>  
      <ion-thumbnail item-left>
        <img src="{{audio.art}}">
        <audio-track-play dark [audioTrack]="audio"><ion-spinner></ion-spinner></audio-track-play>  
      </ion-thumbnail>
      <div item-content style="width:100%">
        <p><strong>{{audio.title}}</strong> ⚬ <em>{{audio.artist}}</em></p>
        <audio-track-progress-bar dark duration progress [audioTrack]="audio" [ngStyle]="{visibility: audio.completed > 0 ? 'visible' : 'hidden'}"></audio-track-progress-bar>
      </div>
    </ion-item>    
  </audio-track>
</ion-list>
```

# Ionic 1.x

The source code for [Ionic 1.x](https://github.com/arielfaur/ionic-audio)
See [http://arielfaur.github.io/ionic-audio/index.html](http://arielfaur.github.io/ionic-audio/index.html) for Demo and Installation 

# Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

Thank you, [contributors]!

[contributors]: https://github.com/arielfaur/ionic-audio/graphs/contributors


# Author

* **Ariel Faur** [@arielfaur](https://github.com/arielfaur)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details