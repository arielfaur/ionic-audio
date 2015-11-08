angular.module('ionic-audio').directive('ionAudioProgress', ionAudioProgress);

function ionAudioProgress() {
    return {
        restrict: 'E',
        scope: {
            track: '='
        },
        template: '{{track.progress | time}}'
    }
}
