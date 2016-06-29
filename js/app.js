/**
* @ngdoc overview
* @name InApp Billing Module
* @author Christophe Eble <ceble@nexway.com>
* @author Titouan Freville <tfreville@nexway.com>
* @description Main module for InApp Billing
*
* @usage
*
* ```
* #/{GUID}
* ```
*/
/* jshint +W097 */
'use strict';
/*jshint -W097 */
var jirallo=angular.module('jirallo', [ 'ngRoute', 'ui.router', 'angoose.client' ,'jirallo.loginCtrl', 'jirallo.tickets', 'jirallo.comment']);
jirallo.config(function ($stateProvider, $urlRouterProvider, $routeProvider) {
  $stateProvider
    .state('jiralo', {
      url: '',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
     })

    .state('index', {
      url: '/index',
      controller: 'mainCtrl',
      templateUrl: 'main_view.html'
    })

    .state('logged', {
      url: '/logged',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/index.html'
    })

    .state('listtickets', {
      url: '/listtickets',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/show.html'
    })

    .state('mytickets', {
      url: '/mytickets',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/myticket.html'
    })

    .state('details', {
      url: '/details',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/details.html'
    })

    .state('addticket', {
      url: '/addticket',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
        var ispo;
        if ($rootScope.userRole) ispo = ($rootScope.userRole == 'ProductOwner')
        else {
          if ($window.sessionStorage.userName) ispo = ($window.sessionStorage.userRole == 'ProductOwner');
        }
        console.log(ispo);
        if (ispo == false) {
          $window.alert('You are not allowed to access this space');
          $state.go('logged');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/add.html'
    })

    .state('edit', {
      url: '/edit',
      onEnter: function($rootScope, $window, $state) {
        if (!($rootScope.userName || $window.sessionStorage.userName)) {
          $window.alert('You are log in the application. Please login before trying to access.');
          $state.go('index');
        }
        var ispo;
        if ($rootScope.userRole) ispo = ($rootScope.userRole == 'ProductOwner')
        else {
          if ($window.sessionStorage.userName) ispo = ($window.sessionStorage.userRole == 'ProductOwner');
        }
        console.log(ispo);
        if (ispo == false) {
          $window.alert('You are not allowed to access this space');
          $state.go('logged');
        }
      },
      controller: 'mainCtrl',
      templateUrl: 'private/edit.html'
    })
  ;

  $urlRouterProvider.otherwise('/index');
})

jirallo.controller('mainCtrl',['$rootScope', '$scope', '$window', '$state', function($rootScope, $scope, $window, $state) {
  if ($rootScope.userName) $scope.userName = $rootScope.userName
  else $scope.userName = $window.sessionStorage.userName;
  $scope.logged = angular.isDefined($scope.userName);
  if ($rootScope.userRole) $scope.ispo = ($rootScope.userRole == 'ProductOwner')
  else $scope.ispo = ($window.sessionStorage.userRole == 'ProductOwner');
}]);

jirallo.controller('logoutCtrl', ['$scope', '$window', '$rootScope', '$state', '$http', function($scope, $window, $rootScope, $state, $http) {
  $scope.destroy = function() {
    $rootScope.userName=null;
    $rootScope.userRole=null;
    $window.sessionStorage.clear();
    $http({
      method: 'POST',
      url: '/destroy_session'
    }).success(function(res){
      $window.alert(res.message);
      $state.go('index');
    })
  }
}])