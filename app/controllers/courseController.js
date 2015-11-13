'use strict';
app.controller('courseController', ['$scope', 'utilityService', 'courseService', 'roomService', function ($scope, utility, courseService, roomService) {
    
    $scope.courses = courseService.courses;
    $scope.times = roomService.times;
    $scope.rooms = roomService.rooms;

    $scope.courseFilter = {
        options: [
            { "id": 0, name: "all", "text": "All"},
            { "id": 1, name: "unAssigned", "text": "Unassigned Only"},
            { "id": 2, name: "assigned", "text": "Assigned Only"}
        ],
        init: function () {
            this.filter = this.options[0];
            return this;
        },
        set: function (option) {
            this.filter = option;
        },
        displayCourse: function (assigned) {
            if (this.filter.id === 1 && assigned) {
                return false;
            }
            if (this.filter.id === 2 && !assigned) {
                return false;
            }
            return true;
        }
    }.init();
    $scope.hoverFocus = {
        focusId: null,
        isFocused: function (courseId) {
            return this.focusId && this.focusId === courseId;
        },
        set: function (courseId) {
            this.focusId = courseId;
        },
        clear: function () {
            this.focusId = null;
        }
    };
    $scope.textFunc = {
        getRoom: function (id) {
            if (id || id === 0) {
                var room = utility.getById($scope.rooms, id);
                return room.text;
            }

            return "";
        },
        getStartTime: function (name) {
            if (name) {
                var startTime = utility.getByName($scope.times, name);
                return startTime.text;
            }

            return "";
        },
        getEndTime: function (name, length) {
            if (name) {
                var i = utility.getIndexByName($scope.times, name);
                return $scope.times[i + length].text;
            }

            return "";
        },
        
        getApiData: courseService.getSchedule
    };
    $scope.schedule = {
        setCourseToValidate: function (json, roomIndex, timeIndex) {
            var course = angular.fromJson(json);
            $scope.hoverFocus.clear();
            roomService.setCourseToValidate(course.id, course.length, roomIndex, timeIndex);
        },
        clearCourseToValidate: function () {
            roomService.clearCourseToValidate();
        },
        saveCourse: function (json, roomIndex, timeIndex) {
            var course = angular.fromJson(json);
            if (roomService.addCourse(course.id, course.length, roomIndex, timeIndex)) {
                courseService.setCourseSchedule(course.id, $scope.rooms[roomIndex].id, $scope.times[timeIndex].name);
            }
        },
        removeCourse: function (courseId) {
            roomService.removeCourse(courseId);
            courseService.clearCourseSchedule(courseId);
        }
    };
}]);