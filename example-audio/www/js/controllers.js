angular.module('starter.controllers', [])

.controller('MusicCtrl', ['$scope', 'MediaManager', function($scope, MediaManager) {
    var urlprefix = '/android_asset/www/audio/';

    $scope.dynamicTrack = {};

    $scope.tracks = [
        {
            url: urlprefix + '03 - Land Of Confusion.mp3',
            artist: 'Genesis',
            title: 'Land of Confusion'
        },
        {
            url: urlprefix + '02 - Tonight. Tonight. Tonight.mp3',
            artist: 'Genesis',
            title: 'Tonight. Tonight. Tonight'
        }
    ];

    $scope.stopPlayback = function() {
        MediaManager.stop();
    };
    $scope.playTrack = function(index) {
        $scope.dynamicTrack = $scope.tracks[index];

        $scope.togglePlayback = !$scope.togglePlayback;    
    };
}]);
