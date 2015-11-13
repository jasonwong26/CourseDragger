'use strict';
app.factory('roomService', [function () {

    var roomList = [
            { "id": 1, name: "classA", "text": "Classroom A"},
            { "id": 2, name: "hallB", "text": "Lecture Hall B"}
        ],
        timeList = [
            { "id": 0, name: 800, "text": "8:00"},
            { "id": 1, name: 900, "text": "9:00"},
            { "id": 2, name: 1000, "text": "10:00"},
            { "id": 3, name: 1100, "text": "11:00"},
            { "id": 4, name: 1200, "text": "12:00"},
            { "id": 5, name: 1300, "text": "1:00"},
            { "id": 6, name: 1400, "text": "2:00"},
            { "id": 7, name: 1500, "text": "3:00"},
            { "id": 8, name: 1600, "text": "4:00"},
            { "id": 9, name: 1700, "text": "5:00"}
        ],
        toValidate = null,
        service = {};
    
    function CourseTime(time) {
        this.time = time;
        this.used = false;
        this.courseId = null;
        this.status = CourseTime.timeStatus[0];
    }
    CourseTime.timeStatus = [
        { "id": 0, name: "empty", "text": "Empty" },
        { "id": 1, name: "valid", "text": "Valid" },
        { "id": 2, name: "invalid", "text": "Invalid" }
    ];
    CourseTime.prototype.isUsed = function () {
        return this.used;
    };
    CourseTime.prototype.isValid = function () {
        return this.status.id === 1;
    };
    CourseTime.prototype.isInvalid = function () {
        return this.status.id === 2;
    };
    CourseTime.prototype.testIfValid = function (courseId) {
        var result = !this.used;

        /* Valid scenarios:
           - No Course Assigned
           - Current CourseID equals parameter courseID */
        result = result || ((this.courseId || courseId) === courseId);
        
        return result;
    };
    CourseTime.prototype.markUsed = function (courseId) {
        this.used = true;
        this.courseId = courseId;
    };
    CourseTime.prototype.markUnused = function () {
        this.used = false;
        this.courseId = null;
    };
    CourseTime.prototype.markEmpty = function () {
        this.status = CourseTime.timeStatus[0];
    };
    CourseTime.prototype.markValid = function () {
        this.status = CourseTime.timeStatus[1];
    };
    CourseTime.prototype.markInvalid = function () {
        this.status = CourseTime.timeStatus[2];
    };
    
    function buildServiceRooms(rooms, times) {
        var result = angular.copy(rooms),
            courseTimes = [],
            i;
        
        for (i = 0; i < times.length; i += 1) {
            courseTimes.push(new CourseTime(times[i]));
        }
        
        for (i = 0; i < result.length; i += 1) {
            result[i].courseTimes = angular.copy(courseTimes);
        }
        
        return result;
    }
    
    function addCourse(courseId, roomIndex, timeIndex, length, isTemp) {
        var times,
            endTimeIndex,
            isValid,
            i;

        isTemp = isTemp || false;
        length = length || 1;
        endTimeIndex = timeIndex + length;
        times = service.rooms[roomIndex].courseTimes.slice(timeIndex, endTimeIndex);
        
        //Check if course entry is valid
        isValid = length <= times.length ? true : false;
        if (isValid) {
            for (i = 0; i < times.length; i += 1) {
                if (times[i].testIfValid(courseId) === false) {
                    isValid = false;
                    break;
                }
            }
        }
        
        // Update class Time array
        for (i = 0; i < times.length; i += 1) {
            if (isTemp) {
                if (isValid) {
                    times[i].markValid(courseId);
                } else {
                    times[i].markInvalid(courseId);
                }
            } else {
                if (isValid) {
                    times[i].markEmpty();
                    times[i].markUsed(courseId);
                }
            }
        }
        
        return isValid;
    }
    
    function clearCourseToValidate(courseId, roomIndex, timeIndex, length) {
        var times,
            endTimeIndex,
            i;

        length = length || 1;
        endTimeIndex = timeIndex + length;
        times = service.rooms[roomIndex].courseTimes.slice(timeIndex, endTimeIndex);

        // Update class Time array
        for (i = 0; i < times.length; i += 1) {
            times[i].markEmpty();
        }

        toValidate = null;
    }
    
    function removeCourse(courseId) {
        var i,
            n;
        
        for (i = 0; i < service.rooms.length; i += 1) {
            for (n = 0; n < service.rooms[i].courseTimes.length; n += 1) {
                if (service.rooms[i].courseTimes[n].courseId === courseId) {
                    service.rooms[i].courseTimes[n].markUnused();
                }
            }
        }
    }
    
    service.times = timeList;
    service.rooms = buildServiceRooms(roomList, timeList);
        
    service.setCourseToValidate = function (courseId, length, roomIndex, timeIndex) {
        if (toValidate) {
            service.clearCourseToValidate();
        }

        toValidate = {
            "courseId": courseId,
            "roomIndex": roomIndex,
            "timeIndex": timeIndex,
            "length": length
        };

        addCourse(toValidate.courseId, toValidate.roomIndex, toValidate.timeIndex, toValidate.length, true);
    };
    
    service.clearCourseToValidate = function () {
        if (toValidate) {
            clearCourseToValidate(toValidate.courseId, toValidate.roomIndex, toValidate.timeIndex, toValidate.length);
            toValidate = null;
        }
    };
    
    service.addCourse = function (courseId, length, roomIndex, timeIndex) {
        return addCourse(courseId, roomIndex, timeIndex, length, false);
    };
    
    service.removeCourse = removeCourse;

    return service;
}]);