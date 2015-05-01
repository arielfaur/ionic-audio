# ionic-audio
This Ionic module creates a player UI for the cordova-media plugin by providing some Angular directives. It is possible
to customize the look and feel of the player providing an own template as shown in the example ionic project.

__NOTE: I have only tested this on Android devices so far. iOS feedback wanted!__

## Usage

### Install dependencies

[Cordova media plugin]
(https://github.com/apache/cordova-plugin-media)

`ionic plugin add org.apache.cordova.media`

### Install module using bower

`bower info ionic-audio`

### Include JS file

`<script src="dist/ion-audio.js"></script>`

### Inject the dependency in your app's module

`angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-audio'])`

### Define your player UI using directives as in the follow example

```
<ion-view view-title="Music">
  <ion-content>
      <ion-audio-player track="track">
          <div class="list list-inset">
              <div class="item item-thumbnail-left">
                  <img src="{{track.art}}">
                  <h2>{{track.title}}</h2>
                  <p>{{track.artist}}</p>
                  <ion-audio-play></ion-audio-play>
              </div>
              <div class="item">
                <ion-audio-progress-bar display-time></ion-audio-progress-bar>
              </div>
          </div>
      </ion-audio-player>
  </ion-content>
</ion-view>
```

## Directives

### ion-audio-player
This is the main directive. It defines a player linked to a specific audio track, which is to be defined as a scope object
and passed as parameter using the `track` attribute. The player template is defined inside the body of
 `ion-audio-player`. It is possible to have multiple instances on a single view, each one being completely
independent.

```
<ion-audio-player track="myTrack">
...
</ion-audio-player>
```

Then in your controller:
```
$scope.myTrack = {
    url: 'https://www.example.com/my_song.mp3',
    artist: 'Somebody',
    title: 'Song name',
    art: 'img/album_art.jpg'
}
```

### ion-audio-play
This directive takes care of displaying the right play/pause/loading status. It updates the UI accordingly and shows a spinner
while the track is loading.

`<ion-audio-play></ion-audio-play>`

### ion-audio-progress
Shows a progress bar using Ionic's range control. It also displays the track duration and progress if
the `display-time` attribute is present.

`<ion-audio-progress-bar display-time></ion-audio-progress-bar>`

## TODO
+ Test on iOS
+ Implement playlist functionality
+ Implement seek-to functionality using the slider
+ Add parameters to customize default player icons - now hardcoded
+ Replace Ionic range control with SVG to show track progress instead (maybe?)
