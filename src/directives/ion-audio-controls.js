angular.module('ionic-audio').directive('ionAudioControls', function() {
    return {
      restrict: 'EA',
      controller: ['$scope', '$element', ionAudioControlsCtrl]
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
          $scope.track.play();
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
});

