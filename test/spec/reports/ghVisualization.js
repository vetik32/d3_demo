'use strict';

describe('Directive: ghVisualization', function () {
  beforeEach(module('d3DemoApp'));

  var element;

  xit('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<gh-visualization></gh-visualization>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('');
  }));
});
