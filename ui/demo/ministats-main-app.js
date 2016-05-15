'use strict';

ministatsDemoApp

.controller('ministatsDemoAppCtrl', [ '$scope','$http', function($scope, $http) { 

    $scope.form = {
        x: [0.29998503,  0.25058272,  0.62110361,  0.09335537,  0.23726673],
        y: [0.14620198,  0.29766358,  0.42221104,  0.27356068,  0.21425566]
    };

    $scope.submit = function() {
        
    }

}]);
