// the dialog is injected in the specified controller
function ReportDatepickerCtrl($scope, dialog){
  $scope.close = function(result){
    dialog.close(result);
  };
}
