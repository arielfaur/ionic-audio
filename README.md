# ionic-audio
This Ionic module creates a player UI for the cordova-media plugin by providing some Angular directives. It is possible
to customize the look and feel of the player providing an own template as shown in the example ionic project.

## Usage

### Install dependencies

[Cordova media plugin]
(https://github.com/apache/cordova-plugin-media)

```ionic plugin add org.apache.cordova.media```

### Include JS file

``` <script src="dist/ion-audio.js"></script>```

### Inject the dependency in your app's module

``` angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-audio'])```

### Define your player UI using directives as in the follow example

```
<ion-view view-title="Music">
  <ion-content>
      <ion-audio-player ng-repeat="track in tracks" track="track">
          <div class="list list-inset">
              <div class="item item-thumbnail-left">
                  <img src="{{track.art}}">
                  <h2>{{track.title}}</h2>
                  <p>{{track.artist}}</p>
                  <ion-audio-play button-styles="ion-play"></ion-audio-play>
              </div>
              <div class="item">
                <ion-audio-progress-bar display-time></ion-audio-progress-bar>
              </div>
          </div>
      </ion-audio-player>
  </ion-content>
</ion-view>
```

## TODO
+ Implement playlist functionality
+ Add parameters to customize default player icons
+ Replace Ionic range control with SVG to show track progress (maybe?)