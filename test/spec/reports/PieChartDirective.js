'use strict';

describe('Directive: PieChartDirective', function () {
  beforeEach(module('sjCharts'));

  var element;

  xit('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<div pieChart></div>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('');
  }));
});
