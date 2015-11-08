angular.module('ionic-audio').directive('ionAudioPlay', ionAudioPlay);

function ionAudioPlay() {
    return {
        //scope: true,
        restrict: 'A',
        require: ['^^ionAudioTrack', '^^ionAudioControls'],
        link: link
    }

    function link(scope, element, attrs, controllers) {
        var isLoading, currentStatus = 0;

        scope.track = controllers[0].getTrack();

        var controller = controllers[1];

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

        element.on('click', function() {
            if (isLoading) return;  //  debounce multiple clicks

            controller.playTrack();
            togglePlaying();
            if (currentStatus == 0) isLoading = true;
        });

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
