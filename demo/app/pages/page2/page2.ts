import {Page} from 'ionic-angular';
import {AudioTrackComponent, AudioTrackPlayComponent, AudioTrackProgressComponent, AudioTrackProgressBarComponent, AudioTimePipe} from 'ionic-audio/dist/ionic-audio';
import {Provider} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/page2/page2.html',
  directives: [AudioTrackComponent, AudioTrackPlayComponent, AudioTrackProgressComponent, AudioTrackProgressBarComponent]
})
export class Page2 {
  myPodcasts: any[];
  
  constructor() {
    this.myPodcasts = [{  
      src: 'https://archive.org/download/WyntonMarsalis/WyntonMarsalis.mp3',
      title: 'Wynton Marsalis on Louis Armstrong'
    },
    { // non-supported format, will fail
      src: 'https://archive.org/download/WyntonMarsalis/WyntonMarsalis_vbr.m3u',
      title: 'Wynton Marsalis on Louis Armstrong'
    }
    ];
  }
}
