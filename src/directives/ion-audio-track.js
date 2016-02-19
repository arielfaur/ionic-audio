angular.module('ionic-audio').directive('ionAudioTrack', ['MediaManager', '$rootScope', ionAudioTrack]);

function ionAudioTrack(MediaManager, $rootScope) {
    return {
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        restrict: 'E',
        scope: {
            track: '=',
            togglePlayback: '='
        },
        require: 'ionAudioTrack',
        link: link,
        controller: ['$scope', '$element', ionAudioTrackCtrl]
    };

    function link(scope, element, attr, controller) {
        controller.hasOwnProgressBar = element.find('ion-audio-progress-bar').length > 0
    }

    function ionAudioTrackCtrl($scope, $element) {
        var controller = this;

        var init = function(newTrack, oldTrack) {
            if (!newTrack || !newTrack.url) return;

            newTrack.progress = 0;
            newTrack.status = 0;
            newTrack.duration = -1;
            if (oldTrack && oldTrack.id !== undefined) newTrack.id = oldTrack.id; 

            if (MediaManager) {
                MediaManager.add(newTrack, playbackSuccess, null, statusChange, progressChange);
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

        this.start = function() {
            if (!$scope.track || !$scope.track.url) return;

            MediaManager.play($scope.track.id);

            // notify global progress bar if detached from track
            if (!controller.hasOwnProgressBar) notifyProgressBar();

            return $scope.track.id;
        };

        var unbindWatcher = $scope.$watch('track', function(newTrack, oldTrack) {  
            if (newTrack === undefined) return;         
            MediaManager.stop();
            init(newTrack, oldTrack);
        });

        $scope.$on('$destroy', function() {
            unbindWatcher();
            MediaManager.destroy();
        });
    }
}