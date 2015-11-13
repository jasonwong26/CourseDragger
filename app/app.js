'use strict';

var app = angular.module('courseDragger', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'filearts.dragDrop']);

app.config(function ($routeProvider) {

    $routeProvider
        .when("/", {
            controller: "indexController",
            templateUrl: "/app/views/home.html"
        })
        .when("/home", {
            controller: "indexController",
            templateUrl: "/app/views/home.html"
        })
        .when("/demo", {
            controller: "courseController",
            templateUrl: "/app/views/demo.html"
        })
        .otherwise({ redirectTo: "/app/views/error.html" });
});