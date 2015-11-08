angular.module('ionic-audio').filter('duration', Duration);

function Duration() {
    return function (input) {
        return (input > 0) ? $filter('time')(input) : '';
    }
}
