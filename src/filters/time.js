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

