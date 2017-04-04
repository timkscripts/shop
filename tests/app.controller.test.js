
  describe('UNIT : testController', function() {

    beforeEach(module('gameApp'));

    var ctrl, scope, aSearchForm;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('testController', {
		  $scope: scope
		});
    }));

    it('should instantiate the controller properly', function () {
        expect(scope.playerX).toEqual(20);
    });
})

