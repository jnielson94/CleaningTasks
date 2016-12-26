'use strict';

var app = angular.module('cleanliness', []);


app.controller('cleanlinessController', ['$scope', cleanlinessController]);

function cleanlinessController ($scope) {
  $scope.sections = [
    {
      'section': 'No Sections Defined!'
    }
  ];

  $scope.priorities = [
    {
      'name': 'There are no tasks marked as needed!',
      'priority': 1
    }
  ];

  $scope.mailToSubject = 'Top%20Priority%20Tasks%20for%20Today';
  $scope.mailToBody = '1';

  $scope.retrieveSections = function () {
    var database = firebase.database();
    return database.ref('/Nielsons/').once('value').then(function (response) {
      if(response.val() == null) {
        console.log("Uh....");
      }
      console.log(response.val().sections)
      $scope.$apply(function() {
        $scope.sections = angular.copy(response.val().sections);
      })
    });
  };

  $scope.updatePriorities = function () {
    $scope.priorities = [];
    $scope.sections.map(function (currentValue, index, array) {
      var sectionTasks = currentValue.tasks;
      sectionTasks.forEach(function (currentValue, index, array) {
        if (currentValue.needed) {
          $scope.priorities.push(currentValue);
        }
      });
    });
    if ($scope.priorities.length === 0) {
      $scope.priorities = [
        {
          'name': 'There are no tasks marked as needed!',
          'priority': 1
        }
      ];
    }
    else {
      $scope.priorities.sort(function (a, b) {
        return a.priority - b.priority;
      });
      $scope.updateMailtoLink();
    }
  };

  $scope.updateMailtoLink = function () {
    var stringPriorities = 'Your top priorities are: ';
    $scope.priorities.forEach(function (current, index) {
      stringPriorities += '\r\n' + (index + 1) + '. ' + current.name;
    });
    console.log(stringPriorities);
    $scope.mailToBody = encodeURIComponent(stringPriorities);
  };

  $scope.retrieveSections();
}

