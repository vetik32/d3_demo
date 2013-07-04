angular.module('sjDates', []).filter('sjDate', function($filter){
  var standardDateFilterFn = $filter('date');

  return function(dateToFormat){
    return standardDateFilterFn(dateToFormat, 'EEEE, MMMM dd');
  }
});
