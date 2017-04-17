var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AudioProvider } from 'ionic-audio';
var HomePage = (function () {
    function HomePage(navCtrl, _audioProvider) {
        this.navCtrl = navCtrl;
        this._audioProvider = _audioProvider;
        // plugin won't preload data by default, unless preload property is defined within json object - defaults to 'none'
        this.myTracks = [{
                src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t12-MP3-V0.mp3',
                artist: 'John Mayer',
                title: 'Why Georgia',
                art: 'assets/img/johnmayer.jpg',
                preload: 'metadata' // tell the plugin to preload metadata such as duration for this track, set to 'none' to turn off
            },
            {
                src: 'https://archive.org/download/JM2013-10-05.flac16/V0/jm2013-10-05-t30-MP3-V0.mp3',
                artist: 'John Mayer',
                title: 'Who Says',
                art: 'assets/img/johnmayer.jpg',
                preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
            }];
        this.singleTrack = {
            src: 'https://archive.org/download/swrembel2010-03-07.tlm170.flac16/swrembel2010-03-07s1t05.mp3',
            artist: 'Stephane Wrembel',
            title: 'Stephane Wrembel Live',
            art: 'assets/img/Stephane.jpg',
            preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
        };
    }
    HomePage.prototype.ngAfterContentInit = function () {
        // get all tracks managed by AudioProvider so we can control playback via the API
        this.allTracks = this._audioProvider.tracks;
    };
    HomePage.prototype.playSelectedTrack = function () {
        // use AudioProvider to control selected track 
        this._audioProvider.play(this.selectedTrack);
    };
    HomePage.prototype.pauseSelectedTrack = function () {
        // use AudioProvider to control selected track 
        this._audioProvider.pause(this.selectedTrack);
    };
    HomePage.prototype.onTrackFinished = function (track) {
        console.log('Track finished', track);
    };
    return HomePage;
}());
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [NavController, Object])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map