'use strict';

ministatsDemoApp

.controller('ministatsDemoAppCtrl', [ '$scope','$http', function($scope, $http) { 

    $scope.form = {
        x: getRandoms(5),
        y: getRandoms(5),
        length: 5
    };
    $scope.submitted = false;

    $scope.generate = function() {
        $scope.form.x = getRandoms($scope.form.length);
        $scope.form.y = getRandoms($scope.form.length);
    }

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
                // Retrieve the result
                request = {
                    method  : 'GET',
                    url     : success.config.url + '/' + success.data._id
                }

                $http(request)
                    .then(function(success){
                        if(success.data.result) {
                            var res = success.data.result;
                            // Plot result
                            // TODO use a directive
                            var trace1 = {
                                  x: $scope.form.x,
                                  y: $scope.form.y,
                                  mode: 'markers',
                                  type: 'scatter'
                            };
                            var Y = [];
                            $scope.form.x.forEach(function(e){
                                Y.push(res.slope * e + res.intercept);
                            });
                            var trace2 = {
                                  x: $scope.form.x,
                                  y: Y
                            };
                            var data = [trace1, trace2];

                            Plotly.newPlot('linregress.node', data, {'title': 'Result'});
                        }
                        $scope.submitted = false;
                    },function(error){
                        console.log(error);
                        $scope.submitted = false;
                    });

            }, function(error){
                console.log(error);
                $scope.submitted = false;
            });
    };

    /**
     * Generate an array of <length> float numbers between 0 and 1.
     */
    function getRandoms(length) {
        var r = [];
        if (typeof length !== 'number' || length < 1)
            length = 1;

        for(var i=0; i<length; i++)
            r.push(Math.random())

        return r;
    };

}]);
