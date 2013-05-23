'use strict';

angular.module('d3DemoApp')
    .controller('LoginCtrl', function ($scope, $routeParams, $location) {
      $scope.auth = function () {
        $location.url('/chart');
      };

      var root = $('.loginBackground');
      var placeholders = [];

      root.find('label').hide();

      var inputs = root.find('.input');
      inputs.each(function (index, item) {
        placeholders.push(item.placeholder);
      });

      $scope.switchMode = function () {
        root.find('label').toggle();
        inputs.each(function (index) {
          this.placeholder = this.placeholder ? '' : placeholders[index];
        });
      };
    });
