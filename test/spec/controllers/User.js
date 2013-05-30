'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('d3DemoApp'));

  var UserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserCtrl = $controller('UserCtrl', {
      $scope: scope
    });
  }));

  it('should attach a user profile', function () {
    expect(scope.user.name.length).toBeGreaterThan(0);
  });
});
