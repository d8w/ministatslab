'use strict';

ministatsDemoApp

.controller('ministatsDemoAppCtrl', [ '$scope','$http', '$timeout', function($scope, $http, $timeout) { 

    $scope.form = {
        x: [0.29998503,  0.25058272,  0.62110361,  0.09335537,  0.23726673],
        y: [0.14620198,  0.29766358,  0.42221104,  0.27356068,  0.21425566]
    };
    $scope.submitted = false;

    $scope.submit = function() {
        if($scope.submitted)
            return;
        $scope.submitted = true;

        var request = {
            method  : 'POST',
            url     : 'http://127.0.0.1:5000/api/linregress',
            data    : {x:$scope.form.x, y:$scope.form.y}
        } 

        $http(request)
            .then(function(success){
                request = {
                    method  : 'GET',
                    url     : success.config.url + '/' + success.data._id
                }
                $http(request)
                    .then(function(success){
                        console.log(success);
                        $scope.submitted = false;
                    },function(error){
                        console.log(error);
                        $scope.submitted = false;
                    });
            }, function(error){
                console.log(error);
                $scope.submitted = false;
            });
    }

}]);
