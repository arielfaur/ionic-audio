angular.module('ionic-audio').directive('ionAudioDuration', ionAudioDuration);

function ionAudioDuration() {
    return {
        restrict: 'E',
        scope: {
            track: '='
        },
        template: '{{track.duration | duration}}'
    }
}
