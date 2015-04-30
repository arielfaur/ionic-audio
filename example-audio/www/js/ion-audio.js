angular.module('ionic-audio', ['ionic'])
    .filter('time', function() {
        return function(input) {
            input = input || '0';

            var t = parseInt(input,10);

            var addLeadingZero = function(n) {
                return (n < 10) ? '0' + n : n;
            };
            return addLeadingZero(Math.floor(t / 60)) + ':' + addLeadingZero(t % 60);
        };
    })

    .directive('ionAudioPlayer', ['$interval', '$ionicPlatform', function($interval,  $ionicPlatform) {
        return {
            transclude: true,
            template: '<div ng-transclude></div>',
            restrict: 'E',
            scope: {
                track: '='
            },
            controller: ['$scope', function($scope) {

                var media, playerStatus = 0, playerTimer, controller = this;

                $scope.track.hasLoaded = false;
                $scope.track.status = 0;
                $scope.track.duration = -1;
                $scope.track.progress = 0;

                this.init = function() {

                    media = new Media($scope.track.url, this.playbackSuccess, null, this.statusChange);
                };

                this.startTimer = function() {
                    if ( angular.isDefined(playerTimer) ) return;

                    playerTimer = $interval(function() {
                        if ( $scope.track.duration < 0){
                            $scope.track.duration = media.getDuration();
                        }

                        media.getCurrentPosition(
                            // success callback
                            function(position) {
                                if (position > -1) {
                                    $scope.track.progress = position;
                                }
                            },
                            // error callback
                            function(e) {
                                console.log("Error getting pos=" + e);
                            });
                    }, 1000);
                };

                this.stopTimer = function() {
                    if (angular.isDefined(playerTimer)) {
                        $interval.cancel(playerTimer);
                        playerTimer = undefined;
                    }
                };

                this.releaseMedia = function() {
                    if (angular.isDefined(media)) {
                        media.stop();
                        media.release();
                        media = undefined;
                    }
                };
                this.playbackSuccess = function() {
                    $scope.track.hasLoaded = false;
                    $scope.track.status = 0;
                    //$scope.track.duration = -1;
                    $scope.track.progress = 0;

                    controller.stopTimer();
                    controller.releaseMedia();
                };
                this.statusChange = function(status) {
                    // track has finished loading!
                    if (!$scope.track.hasLoaded && status == Media.MEDIA_RUNNING) {
                        $scope.track.hasLoaded = true;
                        $scope.$broadcast('ionic-audio:trackLoaded');
                    }

                    $scope.track.status = status;

                    $scope.$broadcast('ionic-audio:statusChange', status);
                };
                this.play = function() {
                    if (media) {
                        if ($scope.track.status == Media.MEDIA_RUNNING) {
                            console.log('ionic-audio: pausing...');
                            media.pause();
                            controller.stopTimer()
                        } else {
                            console.log('ionic-audio: playing...');
                            media.play();
                            controller.startTimer();
                        }

                    }
                }
            }],
            link: function(scope, element, attrs, controller) {

                if (!scope.track.url) {
                    console.log('ionic-audio: missing audio url');
                    return;
                }

                $ionicPlatform.ready(function() {
                    if (!window.cordova && !window.Media) {
                        console.log("ionic-audio: missing Cordova Media plugin. Have you installed the plugin? \nRun 'ionic plugin add org.apache.cordova.media'");
                        return;
                    }

                    controller.init();
                }, false);

                scope.$on('$destroy', function() {
                    // Make sure that the interval is destroyed too
                    controller.stopTimer();
                    controller.releaseMedia();
                });


            }
        }
    }])
    .directive('ionAudioPlay', ['$ionicPlatform', function($ionicPlatform) {
        return {
            restrict: 'EA',
            scope: true,
            template: '<a class="button button-icon icon"><ion-spinner icon="ios" class="ng-hide"></ion-spinner></a>',
            require: '^^ionAudioPlayer',
            link: function(scope, element, attrs, controller) {
                var
                    playControl = element.find('a');

                playControl.addClass(attrs.playIcon);
                element.find('svg').css('height', '20px').css('width', '20px');

                var toggleSpinner = function() {
                    element.find('ion-spinner').toggleClass('ng-hide');
                };

                element.on('click', function() {
                    // call main directive's play method
                    controller.play();
                });

                $ionicPlatform.ready(function() {
                    scope.$on('ionic-audio:trackLoaded', function () {

                        toggleSpinner();
                        playControl.addClass(attrs.pauseIcon);

                    });
                    scope.$on('ionic-audio:statusChange', function (e, status) {
                        switch (status) {
                            case Media.MEDIA_STARTING:
                                playControl.removeClass(attrs.playIcon);
                                toggleSpinner();
                                break;
                            case Media.MEDIA_PAUSED:
                                playControl.removeClass(attrs.pauseIcon).addClass(attrs.playIcon);
                                break;
                            case Media.MEDIA_RUNNING:
                                playControl.addClass(attrs.pauseIcon).removeClass(attrs.playIcon);
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
            scope: true,
            require: '^^ionAudioPlayer',
            link: function(scope, element, attrs, controller) {
                if (!angular.isDefined(attrs.displayTime)) {
                    element.find('ion-audio-progress').remove();
                    element.find('ion-audio-duration').remove();
                }
            }
        }
    }])
    .directive('ionAudioProgress', [function() {
        return {
            restrict: 'E',
            template: '{{track.progress | time}}',
            scope: true,
            require: '^^ionAudioPlayer',
            link: function(scope, element, attrs, controller) {

            }
        }
    }])
    .directive('ionAudioDuration', [function() {
        return {
            restrict: 'E',
            template: '{{track.duration | time}}',
            scope: true,
            require: '^^ionAudioPlayer',
            link: function(scope, element, attrs, controller) {
                element.addClass('ng-hide');

                var listener = scope.$watch('track.duration', function(newVal) {
                    if (newVal > 0) {
                        element.removeClass('ng-hide');
                        listener();
                    }
                });
            }
        }
    }])
;