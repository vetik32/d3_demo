var DatepickerCtrl = function ($scope, dialog) {
  $scope.select = function (from, to) {
    dialog.close({
      from: from,
      to: to
    });
  };
};
