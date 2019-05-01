var app = angular.module("recipeSearch", []);

app.controller("recipeSearchCtrl", function($scope, $http){

    $scope.ingredients = [];

    $scope.recipes = [];

    $scope.message = "";

    $scope.showRecipeTable =false;
    $scope.showLoader = false;

    // Reference: https://www.w3schools.com/angular/default.asp , https://www.w3schools.com/angular/angular_application.asp
    $scope.addIngredient = function() {

        if(!$scope.addIn){

            return;

        }

        if ($scope.ingredients.indexOf($scope.addIn) == -1){

            $scope.ingredients.push($scope.addIn);

            $scope.addIn = "";

        }else {

            $scope.errorMsg = "Ingredient already added.";

        }

    }
    $scope.selectedOrder = function(x){
        $scope.sortOrder = x;
    }

    $scope.removeIngredient = function (x) {

        $scope.ingredients.splice(x, 1);
        $scope.errorMsg = "";

    }

    $scope.recipeSearch = function() {
        $scope.showLoader = true;

        $http.post("test.php").then

        $http({

            method: 'POST',

            url: 'recipe_king.php',

            data: {

                'ingredients': $scope.ingredients

            },

            headers: { 'Content-Type': 'application/json' }

        }).then(function mySuccess(response) {
            $scope.showLoader = false;
            $scope.showRecipeTable = true;

            $scope.message = response.data;

            for(var i=0; i<response.data.hits.length; i++){

                $scope.recipes[i] = response.data.hits[i].recipe

            }

        }, function myError(response) {

            $scope.message = response.statusText;

        });

    }



});

