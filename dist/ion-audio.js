angular.module('ionic-audio', ['ionic'])
    .filter('time', function() {
        return function(input) {
            input = input || 0;

            var t = parseInt(input,10);

            var addLeadingZero = function(n) {
                return (n < 10) ? '0' + n : n;
            };
            return addLeadingZero(Math.floor(t / 60)) + ':' + addLeadingZero(t % 60);
        };
    })
    .filter('duration', function($filter) {
        return function (input) {
            return (input > 0) ? $filter('time')(input) : '';
        }
    })
    .factory('MediaManager', ['$interval', '$timeout', '$window', function($interval, $timeout, $window) {
        var tracks = [], currentTrack, currentMedia, playerTimer;

        if (!$window.cordova && !$window.Media) {
            console.log("ionic-audio: missing Cordova Media plugin. Have you installed the plugin? \nRun 'ionic plugin add org.apache.cordova.media'");
            return null;
        }

        var startTimer = function() {
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

        };

        var stopTimer = function() {
            if (angular.isDefined(playerTimer)) {
                $interval.cancel(playerTimer);
                playerTimer = undefined;
            }
        };

        var releaseMedia = function() {
            if (angular.isDefined(currentMedia)) {
                currentMedia.release();
                currentMedia = undefined;
                currentTrack = undefined;
            }
        };

        var onSuccess = function() {
            stopTimer();
            releaseMedia();

            if (angular.isFunction(this.onSuccess))
                this.onSuccess();
        };

        var onError = function() {
            if (angular.isFunction(this.onError))
                this.onError();
        };

        var onStatusChange = function(status) {
            this.status = status;

            if (angular.isFunction(this.onStatusChange))
                this.onStatusChange(status);
        };

        var createMedia = function(track) {
            if (!track.url) {
                console.log('ionic-audio: missing track url');
                return undefined;
            }

            return new Media(track.url,
                angular.bind(track, onSuccess),
                angular.bind(track, onError),
                angular.bind(track, onStatusChange));

        };

        var destroy = function() {
            stopTimer();
            releaseMedia();
        };

        var stop = function() {
            console.log('ionic-audio: stopping track ' + currentTrack.title);
            currentMedia.stop();    // will call onSuccess...

            currentTrack = undefined;
        };

        var pause = function() {
            console.log('ionic-audio: pausing track '  + currentTrack.title);

            currentMedia.pause();
            stopTimer();
        };

        var resume = function() {
            console.log('ionic-audio: resuming track ' + currentTrack.title);

            currentMedia.play();
            startTimer();
        };


        var play = function(trackID) {
            currentTrack = tracks[trackID];

            console.log('ionic-audio: playing track ' + currentTrack.title);

            currentMedia = createMedia(currentTrack);
            currentMedia.play();

            startTimer();

        };

        /*
        Creates a new Media from a track object

         var track = {
             url: 'https://s3.amazonaws.com/ionic-audio/Message+in+a+bottle.mp3',
             artist: 'The Police',
             title: 'Message in a bottle',
             art: 'img/The_Police_Greatest_Hits.jpg'
         }
         */
        return {

            addTrack: function(track, onSuccessCallback, onErrorCallback, onStatusChangeCallback, onProgressCallback) {
                if (!track.url) {
                    console.log('ionic-audio: missing track url');
                    return;
                }
                angular.extend(track, {
                    onSuccess: onSuccessCallback,
                    onError: onErrorCallback,
                    onStatusChange: onStatusChangeCallback,
                    onProgress: onProgressCallback,
                    status: 0,
                    duration: -1,
                    progress: 0
                });
                var index = tracks.push(track) - 1;
                tracks[index].id = index;
                return index;
            },
            play: function(trackID) {
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
                    play(trackID);
                }, 1000);

            },

            destroy: function() {
                destroy();
            }

        }

    }])
    .directive('ionAudioTrack', ['$interval', '$ionicPlatform', '$rootScope', 'MediaManager', function($interval,  $ionicPlatform, $rootScope, MediaManager) {
        return {
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            restrict: 'E',
            scope: {
                track: '='
            },
            controller: ['$scope', function($scope) {

                var controller = this;

                $scope.track.id = -1;
                $scope.track.status = 0;
                $scope.track.duration = -1;
                $scope.track.progress = 0;

                this.init = function() {
                    $scope.track.id = MediaManager.addTrack($scope.track, this.playbackSuccess, null, this.statusChange, this.progressChange);
                };

                this.playbackSuccess = function() {
                    $scope.track.status = 0;
                    $scope.track.progress = 0;

                };
                this.statusChange = function(status) {
                    $scope.track.status = status;

                    $scope.$broadcast('ionic-audio:statusChange', status);

                    $rootScope.$broadcast('ionic-audio:globalCurrentTrack', $scope.track);
                };
                this.progressChange = function(progress, duration) {
                    $scope.track.progress = progress;
                    $scope.track.duration = duration;

                    $rootScope.$broadcast('ionic-audio:progressChange', progress, duration);
                };
                this.play = function() {
                    if (!MediaManager) return;

                    if ($scope.track.id < 0) {
                        controller.init();
                    }

                    MediaManager.play($scope.track.id);
                }
            }],
            link: function(scope) {

                if (!scope.track.url) {
                    console.log('ionic-audio: missing audio url');
                    return;
                }

                scope.$on('$destroy', function() {
                    MediaManager.destroy();
                });

            }
        }
    }])
    .directive('ionAudioPlay', ['$ionicPlatform', function($ionicPlatform) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
            },
            template: '<ng-transclude></ng-transclude><ion-spinner icon="ios" class="ng-hide"></ion-spinner>',
            require: '^^ionAudioTrack',
            link: function(scope, element, attrs, controller) {
                var
                    playElem = element.find('a'), spinnerElem = element.find('ion-spinner'), hasLoaded;

                spinnerElem.css({position: 'relative', top: '8px', left: '8px;'});

                function toggleSpinner() {
                    spinnerElem.toggleClass('ng-hide');
                }

                function togglePlayButton(hasStopped) {
                    if (hasStopped) {
                        playElem.addClass('ion-play').removeClass('ion-pause');
                    } else {
                        playElem.toggleClass('ion-play ion-pause');
                    }
                }

                $ionicPlatform.ready(function() {

                    element.on('click', function() {
                        if (!hasLoaded) toggleSpinner();

                        // call main directive's play method
                        controller.play();
                    });

                    scope.$on('ionic-audio:statusChange', function (e, status) {

                        switch (status) {
                            case Media.MEDIA_STARTING:
                                hasLoaded = false;
                                break;
                            case Media.MEDIA_PAUSED:
                                togglePlayButton();
                                break;
                            case Media.MEDIA_RUNNING:
                                if (!hasLoaded) {
                                    toggleSpinner();
                                    hasLoaded = true;
                                }
                                togglePlayButton();
                                break;
                            case Media.MEDIA_STOPPED:
                                hasLoaded = false;
                                togglePlayButton(true);
                                break;
                        }
                    });
                });
            }
        }
    }])
    .directive('ionAudioProgressBar', [function() {
        return {
            restrict: 'E',
            template: '<div class="range"><ion-audio-progress></ion-audio-progress><input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress"><ion-audio-duration></ion-audio-duration></div>',
            link: function(scope, element, attrs) {
                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }
            }
        }
    }])
    .directive('ionAudioProgressBox', [function() {
        return {
            restrict: 'E',
            template: '<h2 ng-style="displayTrackInfo()">{{track.title}} - {{track.artist}}</h2><div class="range"><ion-audio-progress></ion-audio-progress><input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress"><ion-audio-duration></ion-audio-duration></div>',
            scope: {},
            link: function(scope, element, attrs) {

                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }

                scope.displayTrackInfo = function() {
                    var visibility = scope.track.artist && scope.track.title ? 'visible' : 'hidden';
                    return { visibility: visibility}
                };

                scope.track = {
                    progress: 0,
                    duration: -1
                };

                scope.$on('ionic-audio:globalCurrentTrack', function (e, track) {
                    // display track info in global progress bar
                    if (track.status == Media.MEDIA_STARTING) {
                        scope.track.artist = track.artist;
                        scope.track.title = track.title;
                    }
                });

                scope.$on('ionic-audio:progressChange', function (e, progress, duration) {
                    scope.track.progress = progress;
                    scope.track.duration = duration;
                });
            }
        }
    }])
    .directive('ionAudioProgress', [function() {
        return {
            restrict: 'E',
            template: '{{track.progress | time}}',
            link: function(scope, element, attrs) {
            }
        }
    }])
    .directive('ionAudioDuration', [function() {
        return {
            restrict: 'E',
            template: '{{track.duration | duration}}',
            link: function(scope, element, attrs) {
            }
        }
    }])
;