// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);


demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/adduser', {
    templateUrl: 'partials/adduser.html',
    controller: 'AddUserController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TasksController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UsersController'
  }).
  when('/userdetails', {
     templateUrl: 'partials/userdetails.html',
     controller: 'UserDetailsController'
   }).
   when('/taskdetails', {
     templateUrl: 'partials/taskdetails.html',
      controller: 'TaskDetailsController'
    }).
   when('/addtask', {
      templateUrl: 'partials/addtask.html',
      controller: 'AddTaskController'
   }).
   when('/edittask', {
      templateUrl: 'partials/edittask.html',
      controller: 'EditTaskController'
   }).
  otherwise({
    redirectTo: '/settings'
  });
}]);