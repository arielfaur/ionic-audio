# ionic-audio
This module creates an audio player UI for Ionic. It is basically a facade to the cordova-media plugin and provides an Angular service and set of directives to create an audio player. The UI takes care of displaying track information, progress bar(s) and loading spinners and it keeps all in sync. The underlying service will also interface with the Media API and handle media creation/playback/pause/stop events.  

It is possible to customize the look and feel by providing a template as shown in the demo below and the example project included.

__NOTE: I have only tested this on :__

+ Android 5.1
+ Android 4.1.2
+ Android 4.1.2 w/ Crosswalk (much better UI performance)

__iOS feedback wanted!__

## Demo
You need a real device to test audio playback but these demos can be used to tweak the UI. You can also run the example
projects locally with `ionic serve` if you prefer.

1. [List audio tracks with a global progress bar] (http://codepen.io/arielfaur/full/JddevO/)

2. [List independent audio tracks with embedded progress bar] (http://codepen.io/arielfaur/full/rVVQKy/)

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
                  <ion-audio-controls>
                        <a class="button button-icon icon" ion-audio-play></a>
                        <ion-spinner icon="ios"></ion-spinner>
                    </ion-audio-controls>
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
Creates an audio track from a JSON object passed as parameter using the `track` attribute. The player UI is defined inside the body of
 `ion-audio-track`. Supports multiple instances per view, each one being completely
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

### ion-audio-controls
Container for `ion-audio-play` and `ion-spinner` directives. The spinner is automatically hidden/shown when needed.

### ion-audio-play
Displays play/pause/loading status. Simply apply this attribute to an `a` or `button` element. It updates the UI accordingly and shows a spinner
while the track is loading.
Additionally, the attributes `text-play` and `text-pause` may be used to include a label for each status.

`<a class="button button-icon icon" ion-audio-play></a>`

`<button class="button button-small button-assertive icon-left" ion-audio-play text-play="Play" text-pause="Pause"></button>`

### ion-audio-progress-bar
Shows a progress bar using Ionic's range control. It also displays the track duration and progress update if
the `display-time` attribute is present.

`<ion-audio-progress-bar display-time></ion-audio-progress-bar>`

Sample use case: tracks listed with an embedded progress bar.

![](https://github.com/arielfaur/ionic-audio/raw/master/screenshots/Screenshot_progress_bar.png)


#### Use as a global progress bar
If a `ion-audio-progress-bar` is placed outside the scope of `ion-audio-track`, it will automatically behave as a standalone bar keeping in sync with the track list. Add a `display-info` attribute to show the current playing track.

`<ion-audio-progress-bar display-time display-info></ion-audio-progress-bar>`

Sample use case: tracks listed with a global progress bar.

![](https://github.com/arielfaur/ionic-audio/raw/master/screenshots/Screenshot_progress_box.png)

## TODO
+ Test on iOS
+ Implement playlist functionality
+ ~~Implement seek-to functionality using the slider~~
+ Implement customization of progress bar and default player icons - now hardcoded
+ Replace Ionic range control with SVG to show track progress instead (maybe?)
