angular.module('ionic-audio').controller('ionAudioTrackCtrl', ionAudioTrackCtrl);

function ionAudioTrackCtrl($scope) {
    var controller = this;

    $scope.track.progress = 0;
    $scope.track.status = 0;
    $scope.track.duration = -1;

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

    this.play = function() {
        if (!MediaManager) return;

        MediaManager.play($scope.track.id);

        // notify global progress bar if detached from track
        if (!controller.hasOwnProgressBar) notifyProgressBar();

        return $scope.track.id;
    };

    this.getTrack = function() {
        return $scope.track;
    };

    if (MediaManager) {
        $scope.track.id = MediaManager.add($scope.track, playbackSuccess, null, statusChange, progressChange);
    }
}

ionAudioTrackCtrl.$inject = ['$scope'];
