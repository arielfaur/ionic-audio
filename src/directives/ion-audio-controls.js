angular.module('ionic-audio').directive('ionAudioControls', ionAudioControls);

function ionAudioControls() {
    return {
      restrict: 'EA',
      scope: {},
      require: ['ionAudioControls', '^^ionAudioTrack'],
      controller: 'ionAudioControlsCtrl',
      link: link
    }

    function link(scope, element, attrs, controllers) {
        var ionAudioTrackCtrl = controllers[1];
        controllers[0].play = ionAudioTrackCtrl.play;

        scope.track = ionAudioTrackCtrl.getTrack();
    }
}
