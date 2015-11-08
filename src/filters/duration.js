angular.module('ionic-audio').filter('duration', Duration);

function Duration($filter) {
    return function (input) {
        return (input > 0) ? $filter('time')(input) : '';
    }
}

Duration.$inject = ['$filter'];
