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
        var currentTrack, currentMedia, playerTimer;

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

        var seekTo = function(pos) {
            if (!currentMedia) return;

            currentMedia.seekTo(pos * 1000);
        };


        var play = function(track) {
            currentTrack = track;

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
            play: function(track) {

                // avoid two tracks playing simultaneously
                if (currentTrack) {
                    if (currentTrack.id == track.id) {
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
                    play(track);
                }, 1000);
            },

            pause: function() {
                pause();
            },

            seekTo: function(pos) {
                pause();

                $timeout(function() {
                    seekTo(pos);
                    resume();
                }, 300);
            },

            destroy: function() {
                destroy();
            }

        }

    }])
    .directive('ionAudio', ['MediaManager', function(MediaManager) {
      return {
          restrict: 'E',
          scope: {
          },
          controller: ['$rootScope', function($rootScope) {
              var tracks = [];

              this.addTrack = function(track, playbackSuccess, playbackError, statusChange, progressChange) {
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

                  track.id  = tracks.push(track) - 1;
                  return track.id;
              };

              this.play = function(trackID) {
                  if (!tracks[trackID]) return;

                  MediaManager.play(tracks[trackID]);

                  $rootScope.$broadcast('ionic-audio:trackChange', tracks[trackID]);
              };

              this.seekTo = function(pos) {
                  MediaManager.seekTo(pos);
              };
          }],
          link: function(scope) {
              scope.$on('$destroy', function() {
                  MediaManager.destroy();
              });
          }
      }
    }])
    .directive('ionAudioTrack', [function() {
        return {
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            restrict: 'E',
            require: ['ionAudioTrack', '^^ionAudio'],
            scope: {
                track: '='
            },
            controller: ['$scope', '$rootScope', function($scope, $rootScope) {
                var ionAudioCtrl;

                if (!$scope.track.url) {
                    console.log('ionic-audio: missing audio url');
                    return;
                }

                var playbackSuccess = function() {
                    $scope.track.status = 0;
                    $scope.track.progress = 0;

                    $rootScope.$broadcast('ionic-audio:trackSuccess');

                };
                var statusChange = function(status) {
                    $scope.track.status = status;
                };
                var progressChange = function(progress, duration) {
                    $scope.track.progress = progress;
                    $scope.track.duration = duration;
                };

                this.seekTo = function(pos) {
                    if (!ionAudioCtrl) return;
                    ionAudioCtrl.seekTo(pos);
                };

                this.play = function() {
                    if (!ionAudioCtrl) return;
                    ionAudioCtrl.play($scope.track.id);

                    return $scope.track.id;
                };

                this.init = function(ctrl) {
                    if (!ctrl) return;
                    ionAudioCtrl = ctrl;

                    $scope.track.id = ionAudioCtrl.addTrack($scope.track, playbackSuccess, null, statusChange, progressChange);
                };
            }],
            link: function(scope, element, attrs, controllers) {
                controllers[0].init(controllers[1]);
            }
        }
    }])
    .directive('ionAudioPlay', ['$ionicPlatform', function($ionicPlatform) {
        return {
            restrict: 'EA',
            transclude: true,
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

                    scope.$watch('track.status', function (status) {
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
                            case Media.MEDIA_NONE:
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
            template: '<div class="range">{{track.progress | time}}<input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress" on-release="sliderRelease()">{{track.duration | duration}}</div>',
            require: '^^ionAudioTrack',
            link: function(scope, element, attrs, controller) {
                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }

                scope.sliderRelease = function() {
                    var pos = scope.track.progress;
                    controller.seekTo(pos);
                }
            }
        }
    }])
    .directive('ionAudioProgressBox', [function() {
        return {
            restrict: 'E',
            require: '^^ionAudio',
            scope: {},
            template: '<h2 ng-style="displayTrackInfo()">{{track.title}} - {{track.artist}}</h2><div class="range">{{track.progress | time}}<input type="range" name="volume" min="0" max="{{track.duration}}" ng-model="track.progress" on-release="sliderRelease()">{{track.duration | duration}}</div>',
            link: function(scope, element, attrs, controller) {
                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }

                function init() {
                    scope.track = {
                        progress: 0,
                        status: 0
                    };
                }

                scope.displayTrackInfo = function() {
                    return { visibility: scope.track.title || scope.track.artist ? 'visible' : 'hidden'}
                };

                scope.sliderRelease = function() {
                    var pos = scope.track.progress;
                    controller.seekTo(pos);
                };

                scope.$on('ionic-audio:trackChange', function (e, track) {
                    scope.track = track;
                });
                scope.$on('ionic-audio:trackSuccess', function () {
                    init();
                });

                init();
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