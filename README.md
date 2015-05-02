# ionic-audio
This Ionic module creates a player UI for the cordova-media plugin by providing some Angular directives. It is possible
to customize the look and feel of the player providing an own template as shown in the example ionic project.

__NOTE: I have only tested this on Android devices so far. iOS feedback wanted!__

## Usage

### Install dependencies

[Cordova media plugin]
(https://github.com/apache/cordova-plugin-media)

`ionic plugin add org.apache.cordova.media`

### Install this module using bower

`bower install ionic-audio`

There's a sample Ionic project in the folder `example-audio`. The project contains not platforms, so you must add
one and make a build if you want to test it on your device.
Keep in mind that the module depends on a Cordova plugin so the module won't run locally with `ionic serve`.
However, you can still run the project locally to tune the UI before deploying to the device.

### Include JS file

`<script src="dist/ion-audio.js"></script>`

### Inject the dependency in your app's module

`angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-audio'])`

### Define your player UI using directives as in the follow example

```
<ion-view view-title="Music">
  <ion-content>
      <ion-audio-track track="track">
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
      </ion-audio-track>
  </ion-content>
</ion-view>
```

## Directives

### ion-audio-track
This is the main directive that must be linked to the audio track defined as a scope object
and passed as parameter using the `track` attribute. The player UI is defined inside the body of
 `ion-audio-track`. It is possible to have multiple instances on a single view, each one being completely
independent.

```
<ion-audio-track track="myTrack">
...
</ion-audio-track>
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

### ion-audio-progress-bar
Shows a progress bar using Ionic's range control. It also displays the track duration and progress if
the `display-time` attribute is present.

`<ion-audio-progress-bar display-time></ion-audio-progress-bar>`

### ion-audio-progress-box
Shows a global progress bar and track info. This directive is used to have a single progress bar per view that is shared
among all tracks defined. Check out the example for a use case.

`<ion-audio-progress-box display-time></ion-audio-progress-box>`

## TODO
+ Test on iOS
+ Implement playlist functionality
+ Implement seek-to functionality using the slider
+ Implement customization of progress bar and default player icons - now hardcoded
+ Replace Ionic range control with SVG to show track progress instead (maybe?)
