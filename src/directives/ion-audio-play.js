angular.module('ionic-audio').directive('ionAudioPlay', ['$ionicGesture', '$timeout', ionAudioPlay]);

function ionAudioPlay($ionicGesture, $timeout) {
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

        var unbindStatusListener = scope.$parent.$watch('track.status', function (status) {
            //  Media.MEDIA_NONE or Media.MEDIA_STOPPED
            if (status == 0 || status == 4) {
                init();
            } else if (status == 2) {   // Media.MEDIA_RUNNING
                isLoading = false;
            }

            currentStatus = status;
        });

        var unbindPlaybackListener = scope.$parent.$watch('togglePlayback', function (newPlayback, oldPlayback) {
            if (newPlayback == oldPlayback) return;
            $timeout(function() {
                togglePlaying();
                controller.play();
            },300)
        });

        init();

        scope.$on('$destroy', function() {
            unbindStatusListener();
            unbindPlaybackListener();
        });
    }
}
