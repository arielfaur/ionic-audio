## v1.3.1

- fix minor bug where track is undefined when placing a progress bar outside the scope of ```ion-audio-track```

## v1.3.0

- make tracks observable to allow dynamic assignment of scope variable ```track``` in ```ion-audio-track```
- updated built-in example to show this use case

### Breaking changes

- ```ion-audio-progress-bar``` has an isolated scope now therefore it will not inherit a track instance from the parent directive unless
it is passed as a property:

````
<ion-audio-progress-bar track="track" display-time></ion-audio-progress-bar>
```` 

For global progress bars that are outside the scope of ```ion-audio-track``` there are no changes.

## v1.2.6

- added minified and uglified script versions
- refactor code into own scripf files
- added global stop() method to MediaManager so that any audio playing can be stopped immediately
- minor performance tweaks

## v1.2.5
- fixed DI issues
- fixed scoping bug in directive ionAudioPlay

## v1.2.4

- fixed bug where pause button was disabled and was not possible to stop playback

## v1.2.3

- fixed slider bug to allow seeking-to when track is paused
- fixed bug when play button is pressed intermittently
- reduced playback delay to 300ms to improve responsiveness

## v1.2.2

- fixed play control responsiveness
- properly cleanup on destroy

### Breaking changes
- added `ion-audio-controls` directive to wrap play buttons and spinner
- `ion-audio-play` is used as attribute and no longer as an element

## v1.2.1

- fixed error when running with `ionic-serve` on a dev machine the MediaManager service is null because
Cordova Media plugin does not exist

## v1.2.0

- added seek-to functionality
- removed unnecessary angular events
- isolated "most" directives scopes
- minor performance issues