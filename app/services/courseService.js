'use strict';
app.factory('courseService', ['utilityService', function (utility) {
 
    var courseList = [
            {
                "id": 145,
                "title": "Civil Procedure",
                "instructor": "Spillenger, Clyde",
                "units": 4,
                "days": "MT",
                "length": 2,
                "schedule": null
            },
            {
                "id": 148,
                "title": "Constitutional Law I",
                "instructor": "Gardbaum, Stephen",
                "units": 4,
                "days": "M",
                "length": 3,
                "schedule": null
            },
            {
                "id": 120,
                "title": "Criminal Law",
                "instructor": "Dolinko, David",
                "units": 4,
                "days": "MWF",
                "length": 1,
                "schedule": null
            },
            {
                "id": 130,
                "title": "Property Law",
                "instructor": "Sander, Richard",
                "units": 4,
                "days": "MWF",
                "length": 1,
                "schedule": null
            },
            {
                "id": 100,
                "title": "Contracts",
                "instructor": "Malloy, Timothy",
                "units": 4,
                "days": "MTh",
                "length": 2,
                "schedule": null
            }
        ],
        service = {};
    
    function getSchedule(courses) {
        var result = [],
            data,
            temp,
            i;

        for (i = 0; i < courses.length; i += 1) {
            data = courses[i].schedule;
            if (data) {
                temp = { "courseId": data.courseId,
                         "roomId": data.roomId,
                         "startTime": data.startTime
                       };

                result.push(temp);
            }
        }
        
        return result;
    }
    
    function setCourseSchedule(courseId, roomId, startTime) {
        var course = utility.getById(service.courses, courseId),
            schedule = { "courseId": courseId,
                         "roomId": roomId,
                         "startTime": startTime
                       };
        
        course.schedule = schedule;
    }
    
    function clearCourseSchedule(courseId) {
        var course = utility.getById(service.courses, courseId);
        
        course.schedule = null;
    }
    
    function buildServiceCourses(courses) {
        var result = angular.copy(courses),
            assigned,
            toJson,
            i;

        assigned = function () {
            return this.schedule ? true : false;
        };
        toJson = function () {
            return angular.toJson(this);
        }

        for (i = 0; i < result.length; i += 1) {
            result[i].assigned = assigned;
            result[i].toJson = toJson
        }

        return result;
    }
    
    service.courses = buildServiceCourses(courseList);

    service.setCourseSchedule = setCourseSchedule;
    service.clearCourseSchedule = clearCourseSchedule;

    service.getSchedule = function () {
        var schedule = getSchedule(service.courses);
        if (schedule.length > 0) {
            return schedule;
        }
        return "";
    };

    return service;
}]);