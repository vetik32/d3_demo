
angular.module('angularMoment', [])
	.directive('amTime', function ($timeout) {
		'use strict';

		return function (scope, element, attr) {

			function updateTime(momentInstance) {
				element.text(momentInstance.format('dddd, MMMM DD'));
			}

			scope.$watch(attr.amTime, function (value) {

        var momentDate = moment();

				if (value) {
					momentDate = moment().subtract('days', value);
				}

				updateTime(momentDate);
			});
		};
	});
