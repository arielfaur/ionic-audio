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