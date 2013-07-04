var DatepickerCtrl = function ($scope, dialog) {

  $scope.dateOptions = {
    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  };

  $scope.rangeIsNotSelected = function(){
    console.log(typeof $scope.from , typeof $scope.to);
    return typeof $scope.from === 'undefined' ||  typeof $scope.to === 'undefined'
  };

  $scope.select = function (from, to) {
    dialog.close({
      from: from,
      to: to
    });
  };

  $scope.cancel = function () {
    dialog.close();
  };
};
