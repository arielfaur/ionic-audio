angular.module('ionic-audio').factory('MediaManager', ['$interval', '$timeout', '$window', function ($interval, $timeout, $window) {
    var tracks = [], currentTrack, currentMedia, playerTimer;

    if (!$window.cordova && !$window.Media) {
        console.log("ionic-audio: missing Cordova Media plugin. Have you installed the plugin? \nRun 'ionic plugin add org.apache.cordova.media'");
        return null;
    }

    return {
        add: add,
        play: play,
        pause: pause,
        stop: stop,
        seekTo: seekTo,
        destroy: destroy
    };

    function find(track) {
        if (track.id < 0) return;

        var replaceTrack = tracks.filter(function(localTrack) {
            return localTrack.id == track.id;
        }).pop();

        if (replaceTrack) {
            tracks.splice(replaceTrack.id, 1, track);
        }
        return replaceTrack;
     }

    /*
    Creates a new Media from a track object

     var track = {
         url: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
         artist: 'The Police',
         title: 'Message in a bottle',
         art: 'img/The_Police_Greatest_Hits.jpg'
     }
     */
    function add(track, playbackSuccess, playbackError, statusChange, progressChange) {
        if (!track.url) {
            console.log('ionic-audio: missing track url');
            return;
        }

        angular.extend(track, {
            onSuccess: playbackSuccess,
            onError: playbackError,
            onStatusChange: statusChange,
            onProgress: progressChange,
            status: 0,
            duration: -1,
            progress: 0
        });

        if (find(track)) {
            return track.id;
        }

        track.id  = tracks.push(track) - 1;
        return track.id;
    }


    function play(trackID) {
        // avoid two tracks playing simultaneously
        if (currentTrack) {
            if (currentTrack.id == trackID) {
                if (currentTrack.status == Media.MEDIA_RUNNING) {
                    pause();
                } else {
                    //if (currentTrack.status == Media.MEDIA_PAUSED) {
                        resume();
                    //}
                }
                return;
            } else {
                if (currentTrack.id > -1) {
                    stop();
                }
            }
        }

        $timeout(function() {
            playTrack(tracks[trackID]);
        }, 300);
    }

    function pause() {
        console.log('ionic-audio: pausing track '  + currentTrack.title);

        currentMedia.pause();
        stopTimer();
    }

    function seekTo(pos) {
        if (!currentMedia) return;

        currentMedia.seekTo(pos * 1000);
    }

    function destroy() {
        stopTimer();
        releaseMedia();
    }


    function playTrack(track) {
        currentTrack = track;

        console.log('ionic-audio: playing track ' + currentTrack.title);

        currentMedia = createMedia(currentTrack);
        currentMedia.play();

        startTimer();
    }

    function resume() {
        console.log('ionic-audio: resuming track ' + currentTrack.title);
        currentMedia.play();
        startTimer();
    }

    function stop() {
        if (currentMedia){
            console.log('ionic-audio: stopping track ' + currentTrack.title);
            currentMedia.stop();    // will call onSuccess...
        }
    }

    function createMedia(track) {
        if (!track.url) {
            console.log('ionic-audio: missing track url');
            return undefined;
        }

        return new Media(track.url,
            angular.bind(track, onSuccess),
            angular.bind(track, onError),
            angular.bind(track, onStatusChange));
    }

    function releaseMedia() {
        if (angular.isDefined(currentMedia)) {
            currentMedia.release();
            currentMedia = undefined;
            currentTrack = undefined;
        }
    }

    function onSuccess() {
        stopTimer();
        releaseMedia();

        if (angular.isFunction(this.onSuccess))
            this.onSuccess();
    }

    function onError() {
        if (angular.isFunction(this.onError))
            this.onError();
    }

    function onStatusChange(status) {
        this.status = status;

        if (angular.isFunction(this.onStatusChange))
            this.onStatusChange(status);
    }

    function stopTimer() {
        if (angular.isDefined(playerTimer)) {
            $interval.cancel(playerTimer);
            playerTimer = undefined;
        }
    }

    function startTimer() {
        if ( angular.isDefined(playerTimer) ) return;

        if (!currentTrack) return;

        playerTimer = $interval(function() {
            if ( currentTrack.duration < 0){
                currentTrack.duration = currentMedia.getDuration();
            }

            currentMedia.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        currentTrack.progress = position;
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                });

            if (angular.isFunction(currentTrack.onProgress))
                currentTrack.onProgress(currentTrack.progress, currentTrack.duration);

        }, 1000);
    }
}]);