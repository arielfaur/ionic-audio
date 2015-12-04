angular.module('ionic-audio').directive('ionAudioTrack', ['MediaManager', '$rootScope', ionAudioTrack]);

function ionAudioTrack(MediaManager, $rootScope) {
    return {
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        restrict: 'E',
        scope: {
            track: '='
        },
        controller: ['$scope', '$element', ionAudioTrackCtrl]
    };

    function ionAudioTrackCtrl($scope, $element) {
        var controller = this, hasOwnProgressBar = $element.find('ion-audio-progress-bar').length > 0;;

        var init = function() {
            $scope.track.progress = 0;
            $scope.track.status = 0;
            $scope.track.duration = -1;

            if (MediaManager) {
               $scope.track.id = MediaManager.add($scope.track, playbackSuccess, null, statusChange, progressChange);
            }
        };

        var playbackSuccess = function() {
            $scope.track.status = 0;
            $scope.track.progress = 0;
        };
        var statusChange = function(status) {
            $scope.track.status = status;
        };
        var progressChange = function(progress, duration) {
            $scope.track.progress = progress;
            $scope.track.duration = duration;
        };
        var notifyProgressBar = function() {
            $rootScope.$broadcast('ionic-audio:trackChange', $scope.track);
        };

        this.seekTo = function(pos) {
            MediaManager.seekTo(pos);
        };

        this.getTrack = function() {
            return $scope.track;
        };

        $scope.track.play = function() {
            if (!MediaManager) return;

            MediaManager.play($scope.track.id);

            // notify global progress bar if detached from track
            if (!controller.hasOwnProgressBar) notifyProgressBar();

            return $scope.track.id;
        };

        $scope.$on('$destroy', function() {
            MediaManager.destroy();
        });

        init();
    }
}

