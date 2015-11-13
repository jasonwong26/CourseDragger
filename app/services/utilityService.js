'use strict';
app.factory('utilityService', [function () {

    var service = {};
    
    service.getById = function ($array, id) {
        return $array.filter(function (e) {
            return e.id === id;
        })[0];
    };

    service.getByName = function ($array, name) {
        return $array.filter(function (e) {
            return e.name === name;
        })[0];
    };
    
    service.getIndexById = function ($array, id) {
        return $array.map(function (e) {
            return e.id;
        }).indexOf(id);
    };
    
    service.getIndexByName = function ($array, name) {
        return $array.map(function (e) {
            return e.name;
        }).indexOf(name);
    };
    
    return service;
}]);