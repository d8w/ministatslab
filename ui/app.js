'use strict';

/** demo */
var ministatsDemoApp = angular.module('ministatsDemoApp', []);

/**
 * The master module
 */
var ministatsApp = angular.module('ministatsApp', [ 'ui.router', 'ministatsDemoApp']);

/**
 * Module configuration
 */
ministatsApp.
config([ '$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('demo', {
		url: '/demo',
		templateUrl: 'demo/ministats-main-app.html'
	});

    $urlRouterProvider.otherwise('/demo'); /** default */
} ]);
