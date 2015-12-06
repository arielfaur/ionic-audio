angular.module('ionic-audio', ['ionic']);

angular.module('ionic-audio').filter('time', function () {
	var addLeadingZero = function(n) {
        return (new Array(2).join('0')+n).slice(-2)
    };

    return function(input) {
        input = input || 0;
        var t = parseInt(input);
        return addLeadingZero(Math.floor(t / 60)) + ':' + addLeadingZero(t % 60);
    };
});


angular.module('ionic-audio').filter('duration', ['$filter', function ($filter) {
    return function (input) {
        return (input > 0) ? $filter('time')(input) : '';
    };
}]);


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
angular.module('ionic-audio').directive('ionAudioTrack', ['MediaManager', '$rootScope', ionAudioTrack]);

function ionAudioTrack(MediaManager, $rootScope) {
    return {
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        restrict: 'E',
        scope: {
            track: '='
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

        $scope.$watch('track', function(newTrack, oldTrack) {   
            if (newTrack === undefined) return;         
            MediaManager.stop();
            init(newTrack, oldTrack);
        });

        $scope.$on('$destroy', function() {
            MediaManager.destroy();
        });
    }
}
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

angular.module('ionic-audio').directive('ionAudioProgressBar', ['MediaManager', ionAudioProgressBar]);

function ionAudioProgressBar(MediaManager) {
    return {
        restrict: 'E',
        scope: {
            track: '='
        },
        template:
            '<h2 class="ion-audio-track-info" ng-style="displayTrackInfo()">{{track.title}} - {{track.artist}}</h2>' +
            '<div class="range">' +
            '<ion-audio-progress track="track"></ion-audio-progress>' +
            '<input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress" on-release="sliderRelease()" disabled>' +
            '<ion-audio-duration track="track"></ion-audio-duration>' +
            '</div>',
        link: link
    };

    function link(scope, element, attrs) {
        var slider =  element.find('input'), unbindTrackListener;

        function init() {
            scope.track.progress = 0;
            scope.track.status = 0;
            scope.track.duration = -1;
        }

        if (!angular.isDefined(attrs.displayTime)) {
            element.find('ion-audio-progress').remove();
            element.find('ion-audio-duration').remove();
        }
        if (!angular.isDefined(attrs.displayInfo)) {
            element.find('h2').remove();
        }

        if (angular.isUndefined(scope.track)) {
            scope.track = {};

            // listens for track changes elsewhere in the DOM
            unbindTrackListener = scope.$on('ionic-audio:trackChange', function (e, track) {
                scope.track = track;
            });
        }

        // disable slider if track is not playing
        var unbindStatusListener = scope.$watch('track.status', function(status) {
            // disable if track hasn't loaded
            slider.prop('disabled', status == 0);   //   Media.MEDIA_NONE
        });

        // hide/show track info if available
        scope.displayTrackInfo = function() {
            return { visibility: angular.isDefined(attrs.displayInfo) && (scope.track.title || scope.track.artist) ? 'visible' : 'hidden'}
        };

        // handle track seek-to
        scope.sliderRelease = function() {
            var pos = scope.track.progress;
            MediaManager.seekTo(pos);
        };

        scope.$on('$destroy', function() {
            unbindStatusListener();
            if (angular.isDefined(unbindTrackListener)) {
                unbindTrackListener();
            }
        });

        init();
    }
}
angular.module('ionic-audio').directive('ionAudioPlay', ['$ionicGesture', ionAudioPlay]);

function ionAudioPlay($ionicGesture) {
    return {
        restrict: 'A',
        require: '^^ionAudioControls',
        link: link
    };

    function link(scope, element, attrs, controller) {
        var isLoading, debounce, currentStatus = 0;

        var init = function() {
            isLoading = false;
            element.addClass('ion-play');
            element.removeClass('ion-pause');
            element.text(attrs.textPlay);
        };

        var setText = function() {
            if (!attrs.textPlay || !attrs.textPause) return;

            element.text((element.text() == attrs.textPlay ? attrs.textPause : attrs.textPlay));
        };

        var togglePlaying = function() {
            element.toggleClass('ion-play ion-pause');
            setText();
        };

        $ionicGesture.on('tap', function() {
            // debounce while loading and multiple clicks
            if (debounce || isLoading) {
                debounce = false;
                return;
            }

            if (currentStatus == 0) isLoading = true;

            controller.play();
            togglePlaying();
        }, element);

        $ionicGesture.on('doubletap', function() {
            debounce = true;
        }, element);

        var unbindStatusListener = scope.$watch('track.status', function (status) {
            //  Media.MEDIA_NONE or Media.MEDIA_STOPPED
            if (status == 0 || status == 4) {
                init();
            } else if (status == 2) {   // Media.MEDIA_RUNNING
                isLoading = false;
            }

            currentStatus = status;
        });

        init();

        scope.$on('$destroy', function() {
            unbindStatusListener();
        });
    }
}

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

angular.module('ionic-audio').directive('ionAudioControls', function() {
    return {
      restrict: 'EA',
      require: ['ionAudioControls', '^^ionAudioTrack'],
      controller: ['$scope', '$element', ionAudioControlsCtrl],
      link: link
    };

    function ionAudioControlsCtrl($scope, $element) {
        var spinnerElem = $element.find('ion-spinner'), hasLoaded, self = this;

        spinnerElem.addClass('ng-hide');

        this.toggleSpinner = function() {
          spinnerElem.toggleClass('ng-hide');
        };

        this.play = function() {
          if (!hasLoaded) {
              self.toggleSpinner();
          }
          //$scope.track.play();
          this.start();
        };

        var unbindStatusListener = $scope.$watch('track.status', function (status) {
            switch (status) {
              case 1: // Media.MEDIA_STARTING
                  hasLoaded = false;
                  break;
              case 2: // Media.MEDIA_RUNNING
                  if (!hasLoaded) {
                      self.toggleSpinner();
                      hasLoaded = true;
                  }
                  break;
              //case 3: // Media.MEDIA_PAUSED
              //    break;
              case 0: // Media.MEDIA_NONE
              case 4: // Media.MEDIA_STOPPED
                  hasLoaded = false;
                  break;
            }
        });

        $scope.$on('$destroy', function() {
          unbindStatusListener();
        });
    }

    function link(scope, element, attrs, controllers) {
        controllers[0].start = controllers[1].start;
    }
});
