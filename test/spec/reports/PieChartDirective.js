'use strict';

describe('Directive: PieChartDirective', function () {
  beforeEach(module('d3DemoApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<-pie-chart-directive></-pie-chart-directive>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the PieChartDirective directive');
  }));
});
