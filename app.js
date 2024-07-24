var app = angular.module('helloWorldApp', []);

app.controller('IndexController', function($scope, $http, $interval) {
    
});

app.controller('LoginController', function($scope, $http, $window) {
    $scope.loginData = {};
    $scope.loginMessage = '';

    $scope.login = function() {
        $http.post('/api/login', $scope.loginData)
            .then(function(response) {
                $scope.loginMessage = 'Login successful!';
                $window.location.href = 'index.html';
            })
            .catch(function(error) {
                $scope.loginMessage = 'Invalid credentials. Please try again.';
            });
    };
});

app.controller('SignupController', function($scope, $http, $window) {
    $scope.signupData = {};
    $scope.signupMessage = '';

    $scope.signup = function() {
        $http.post('/api/signup', $scope.signupData)
            .then(function(response) {
                $scope.signupMessage = 'Signup successful! You can now log in.';
                $scope.signupData = {};
                $window.location.href = 'login.html';
            })
            .catch(function(error) {
                $scope.signupMessage = 'Error during signup. Please try again.';
            });
    };
});

app.controller('AddItemController', function($scope, $http) {
    $scope.itemData = {};

    $scope.addItem = function() {
        $http.post('/api/add-item', $scope.itemData)
            .then(function(response) {
                alert('Item added successfully!');
                $scope.itemData = {}; // Clear the form
            })
            .catch(function(error) {
                alert('Error adding item. Please try again.');
            });
    };
});
