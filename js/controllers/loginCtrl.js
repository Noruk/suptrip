// ProductOwner
'use strict';
var jirallo = angular.module('jirallo.loginCtrl', ['ngCookies']);
jirallo.controller('loginForm', ['$scope', '$rootScope', '$state', '$window', '$http', '$location', function($scope, $rootScope, $state, $window, $http, $location){

  var CredNotProvided = "You are missing something. Please make sure you provided both User name and Password.";
  // $scope.userName='Marsu';
  // $scope.userPass='mars';

  $scope.submit = function () {
    if ($scope.userName && $scope.userPass) {
      $http({
        method: 'POST',
        url: '/signin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        },
        data: {name: $scope.userName , password: $scope.userPass}
      }).success(function() {
        $rootScope.userName=$scope.userName;
        $window.localStorage.setItem('userName', $scope.userName);
        $state.go('logged');
      });
    } else {
      $window.alert(CredNotProvided);
    }
  }
}]);

