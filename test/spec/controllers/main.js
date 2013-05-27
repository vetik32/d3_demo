'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('d3DemoApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should contains states object', function () {
    expect(typeof scope.states).toBe('object');
  });

  it('states object length should be 5', function () {
    expect(scope.states.length).toBe(5);
  });
});
