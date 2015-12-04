angular.module('ionic-audio').filter('duration', ['$filter', function ($filter) {
    return function (input) {
        return (input > 0) ? $filter('time')(input) : '';
    };
}]);

