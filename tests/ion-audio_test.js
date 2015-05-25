describe('Unit testing ionic-audio module', function() {

    // Load the ionic.wizard module, which contains the directive
    beforeEach(module('ionic'));
    beforeEach(module('ionic-audio'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_, _$filter_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $filter = _$filter_;

        scope = $rootScope.$new();

        spyOn($rootScope, '$broadcast').and.callThrough();
    }));

    describe('Time filter', function() {

        it('should convert 60s to 01:00 and add a leading zero', function() {
            var t = 60;
            expect($filter('time')(t)).toBe('01:00');
        });

        it('should convert 95s to 01:35 and add a leading zero', function() {
            var t = 95;
            expect($filter('time')(t)).toBe('01:35');
        });

        it('should convert string representing 5s to 00:05 and add a leading zero', function() {
            var t = '5';
            expect($filter('time')(t)).toBe('00:05');
        });
    });
    describe('Duration filter', function() {

        it('should call time filter and convert 60s to 01:00 and add a leading zero', function() {
            var t = 60;
            expect($filter('time')(t)).toBe('01:00');
        });

        it('should return an empty string is value equals 0', function() {
            var t = 0;
            expect($filter('duration')(t)).toBe('');
        });
    });


});
