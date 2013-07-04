'use strict';

describe('Controller: ReportsCtrl', function () {

  // load the controller's module
  beforeEach(module('d3DemoApp'));

  beforeEach(module('ReportsServices'));

  var ReportsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportsCtrl = $controller('ReportsCtrl', {
      $scope: scope
    });
  }));


  // xit -> it to include this "falling" test TODO: use mocking http request - to produce a fake request/response
  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.eventVolume).toBe({});
  });
});
