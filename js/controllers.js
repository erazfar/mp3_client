var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('AddUserController', ['$scope', 'UserData'  , function($scope, UserData) {
  $scope.name = "";
  $scope.email = "";
  $scope.displayText = "";
    $scope.nameError = false;
    $scope.emailError = false;

  $scope.createUser = function(){
      if($scope.name.length === 0 && $scope.email.length != 0){
          $scope.displayText = "Missing required field";
          $scope.nameError = true;
          $scope.emailError = false;
      }
      else if($scope.email.length === 0 && $scope.name.length != 0){
          $scope.displayText = "Missing required field";
          $scope.emailError = true;
          $scope.nameError = false;
      }
      else if($scope.email.length === 0 && $scope.name.length === 0){
          $scope.displayText = "Missing required field";
          $scope.emailError = true;
          $scope.nameError = true;
      }
      else if($scope.email.indexOf('@') < 1){
          $scope.emailError = true;
          $scope.displayText = "Invalid email";
      }
      else{
          $scope.nameError = false;
          $scope.emailError = false;
          UserData.createUser($scope.name, $scope.email).success(function(data){
              $scope.displayText = data.message;
          }).error(function(data){
              $scope.displayText = data.message;
          });
      }
  };

}]);

demoControllers.controller('AddTaskController', ['$scope', 'TaskData'  , '$http', '$window', function($scope, TaskData, $http, $window) {
    $scope.name = "";
    $scope.description = "";
    $scope.deadline = "";
    $scope.assignedUser = undefined;
    $scope.displayText = "";
    $scope.nameError = false;
    $scope.deadlineError = false;
    $scope.assignedUserName = "";
    $scope.assignedUserId= "";
    var wasUserDefined = true;

    TaskData.getUsers().success(function(data){
        $scope.users = data.data;
    }).error(function(data){
        $scope.displayText = data.message;
    });

    $scope.createTask = function(){
        if($scope.name.length === 0 && $scope.deadline.length != 0){
            $scope.displayText = "Missing required field";
            $scope.nameError = true;
            $scope.deadlineError = false;
        }
        else if($scope.deadline.length === 0 && $scope.name.length != 0){
            $scope.displayText = "Missing required field";
            $scope.deadlineError = true;
            $scope.nameError = false;
        }
        else if($scope.deadline.length === 0 && $scope.name.length === 0){
            $scope.displayText = "Missing required field";
            $scope.deadlineError = true;
            $scope.nameError = true;
        }
        else{
           // $scope.displayText = "made it";
            $scope.nameError = false;
            $scope.deadlineError = false;
            if($scope.assignedUser === undefined){
                wasUserDefined = false;
                $scope.assignedUser = {"_id": "", "name": "", "pendingTasks": []};
            }
            $scope.assignedUser = JSON.parse($scope.assignedUser);
            TaskData.createTask($scope.name, $scope.description, $scope.assignedUser._id, $scope.assignedUser.name, $scope.deadline).success(function(data){
                 if (wasUserDefined){
                     $scope.assignedUser.pendingTasks.append(data.data._id);
                     TaskData.updateUser($scope.assignedUser._id, $scope.assignedUser).success(function(){
                     }).error(function(data){
                         $scope.displayText = data.message;
                     });
                 }
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }
    };

}]);

demoControllers.controller('TasksController', ['$scope', 'Tasks' , '$http', '$window', '$location', function($scope, Tasks, $http, $window, $location) {
    $scope.sortBy = "none";
    $scope.sortOrder = 1;
    $scope.isCompleted = 0;
    $scope.displayText = "Tasks";
    $scope.skipCounter = 0;

    Tasks.get().success(function(data){
        $scope.tasks = data.data;
    });

    $scope.deleteTask = function(id){
        Tasks.delete(id).success(function(data){
            Tasks.get().success(function(data){

                $scope.tasks = data.data;
            });
        });
    };

    $scope.goToDetails = function(id){
        Tasks.setId(id);
        $location.path('taskdetails');
    };

    $scope.showPrevious = function(){
        if($scope.skipCounter > 0) {
            $scope.skipCounter = $scope.skipCounter - 10;
            Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
                $scope.tasks = data.data;
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }

    };

    $scope.showNext = function(){
        if($scope.skipCounter < 1000) {
            $scope.skipCounter = $scope.skipCounter + 10;
            Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
                $scope.tasks = data.data;
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }
    };

    $scope.$watch(function(){return $scope.sortBy}, function(){
        //$scope.displayText = $scope.sortBy;
        Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
            $scope.tasks = data.data;
        }).error(function(data){
            $scope.displayText = data.message;
        });
    });

    $scope.$watch(function(){return $scope.sortOrder}, function(){
        //$scope.displayText = $scope.sortBy;
        Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
            $scope.tasks = data.data;
        }).error(function(data){
            $scope.displayText = data.message;
        });
    });

    $scope.$watch(function(){return $scope.isCompleted}, function(){
        //$scope.displayText = $scope.sortBy;
        Tasks.getFiltered($scope.sortBy, $scope.sortOrder, $scope.isCompleted, $scope.skipCounter).success(function(data){
            $scope.tasks = data.data;
        }).error(function(data){
            $scope.displayText = data.message;
        });
    });

}]);

demoControllers.controller('TaskDetailsController', ['$scope', 'Tasks' , '$http', '$window', '$location', function($scope, Tasks, $http, $window, $location) {
    var taskid = Tasks.getId();
    $scope.showingCompleted = false;
    $scope.displayText = "Task Details";
    Tasks.getById(taskid).success(function(data){
        $scope.tasks = data.data;
    });
    $scope.completeTask = function(){
        $scope.tasks.completed = true;
        Tasks.completeTask($scope.tasks).success(function(data){
            $scope.tasks = data.data;
        }).error(function(data){
            $scope.tasks.completed = false;
            $scope.displayText = data.message;
        });
    };

    $scope.goToEdit = function(){
        $location.path('edittask');
    };

}]);

demoControllers.controller('UsersController', ['$scope', '$http', 'Users', '$window' , '$location', function($scope, $http,  Users, $window, $location) {


    $scope.url = $window.sessionStorage.baseurl;

    Users.get().success(function(data){

     $scope.users = data.data;
    });

    $scope.deleteUser = function(id){
        Users.delete(id).success(function(data){
            Users.get().success(function(data){

                $scope.users = data.data;
            });
        });
    };

    $scope.goToDetails = function(id){
        Users.setId(id);
        $location.path('userdetails');
    }

}]);

demoControllers.controller('UserDetailsController', ['$scope', '$http', 'Users',  function($scope, $http,  Users) {

    var userid = Users.getId();
    $scope.showingCompleted = false;
    $scope.displayText = "User Details";
    Users.getById(userid).success(function(data){
        $scope.users = data.data;
    });

    Users.getPendingTasks(userid).success(function(data){
        $scope.tasks = data.data;
    });

    $scope.completedTask = function(id, otherData){
        otherData.completed = true;
       Users.completeTask(id, otherData).success(function(){
            Users.getPendingTasks(userid).success(function(data){
                $scope.tasks = data.data;
            });
           Users.showCompletedTasks().success(function(data){
               $scope.completedTasks = data.data;
           }).error(function(data){
               $scope.displayText = data.message;
           });
        })
           .error(function(data){
            $scope.displayText = data.message;
        });

    };

    $scope.showCompleted = function(){
        $scope.showingCompleted = true;
        Users.showCompletedTasks().success(function(data){
            $scope.completedTasks = data.data;
        }).error(function(data){
            $scope.displayText = data.message;
        });
    }
}]);

demoControllers.controller('EditTaskController', ['$scope' , 'Tasks', 'TaskData', '$http', '$window' , function($scope, Tasks, TaskData, $http, $window) {
    var taskid = Tasks.getId();
    $scope.displayText = taskid;


    Tasks.getById(taskid).success(function(data){
        $scope.tasks = data.data;
        $scope.name = data.data.name;
        $scope.description = data.data.description;
        $scope.deadline = data.data.deadline;
        $scope.assignedUserName = data.data.assignedUserName;
    }).error(function(data){
        $scope.displayText = data.message;
    });



    $scope.assignedUser = undefined;
    $scope.nameError = false;
    $scope.deadlineError = false;
    var wasUserDefined = true;

    TaskData.getUsers().success(function(data){
        $scope.users = data.data;
    }).error(function(data){
        $scope.displayText = data.message;
    });


    $scope.createTask = function(){
        if($scope.name.length === 0 && $scope.deadline.length != 0){
            $scope.displayText = "Missing required field";
            $scope.nameError = true;
            $scope.deadlineError = false;
        }
        else if($scope.deadline.length === 0 && $scope.name.length != 0){
            $scope.displayText = "Missing required field";
            $scope.deadlineError = true;
            $scope.nameError = false;
        }
        else if($scope.deadline.length === 0 && $scope.name.length === 0){
            $scope.displayText = "Missing required field";
            $scope.deadlineError = true;
            $scope.nameError = true;
        }
        else{
            // $scope.displayText = "made it";
            $scope.nameError = false;
            $scope.deadlineError = false;
            if($scope.assignedUser === undefined){
                wasUserDefined = false;
                $scope.assignedUser = {"_id": "", "name": "", "pendingTasks": []};
            }
            $scope.assignedUser = JSON.parse($scope.assignedUser);
            //$scope.displayText = $scope.assignedUser.name;
            $scope.tasks.name = $scope.name;
            $scope.tasks.description = $scope.description;
            $scope.tasks.deadline = $scope.deadline;
            $scope.tasks.assignedUser = $scope.assignedUser._id;
            $scope.tasks.assignedUserName = $scope.assignedUser.name;
            TaskData.editTask(taskid, $scope.tasks).success(function(data){
                if (wasUserDefined){
                    $scope.assignedUser.pendingTasks.append(data.data._id);
                    TaskData.updateUser($scope.assignedUser._id, $scope.assignedUser).success(function(){
                    }).error(function(data){
                        $scope.displayText = data.message;
                    });
                }
            }).error(function(data){
                $scope.displayText = data.message;
            });
        }
    };

}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


