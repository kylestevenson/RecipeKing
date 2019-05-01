//Angular Control for Recipe King app

var app = angular.module("recipeSearch", ["ngRoute"]);
//Routing to change page views: Home, about, and individual recipe pages
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/home.html",
        controller  : "recipeSearchCtrl"
    })
    .when("/about", {
        templateUrl : "views/about.html",
    })
    .when("/recipe", {
        templateUrl : "views/recipe.html",
        controller  : "recipePageController"
    });
});

//Controller for home page recipe search
app.controller("recipeSearchCtrl", function($scope, $http, $location, recipePassService, recipeKeepService, ingredientKeepService){
    //stores user ingredient list
    $scope.ingredients = ingredientKeepService.get();
    // user diet option
    $scope.dietLabel;
    //user health option
    $scope.healthLabel;
    //keep searched recipes between pages
    $scope.recipes = recipeKeepService.get();
    $scope.showErr = false;

    $scope.message = "";
    $scope.ErrMessage = "";
    //toggle table view if no recipes
    if($scope.recipes === undefined || $scope.recipes.length == 0){
        $scope.showRecipeTable = false;
    }else {
        $scope.showRecipeTable =true;
    }
    //loading spinner for recipe search
    $scope.showLoader = false;

    // Reference: https://www.w3schools.com/angular/default.asp , https://www.w3schools.com/angular/angular_application.asp
    //add user ingredient to ingredients[] if not already in list
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
    //change sort order of recipe table
    $scope.selectedOrder = function(x){
        $scope.sortOrder = x;
    }
    //splice ingredient from ingredients[]
    $scope.removeIngredient = function (x) {

        $scope.ingredients.splice(x, 1);
        $scope.errorMsg = "";

    }
    //perform recipe search with user provided options and data
    $scope.recipeSearch = function() {
        //shows loader while waiting on results
        $scope.showLoader = true;
        //get user diet option
        $scope.dietLabel = $scope.dietSelect;
        //get user health option
        $scope.healthLabel = $scope.healthSelect;
        //http ajax call to php - > api -> return results
        $http({

            method: 'POST',

            url: 'recipe_king.php',

            data: {
                'ingredients': $scope.ingredients,  // POST the user-specified ingredients health and diet options, to the php file
                'dietLabel': $scope.dietLabel,
                'health': $scope.healthLabel
            },

            headers: { 'Content-Type': 'application/json' }
            //on success
        }).then(function mySuccess(response) {
            //hide loader
            $scope.showLoader = false;
            

            $scope.message = response.data;
            //if no results returned
            if(typeof response.data.hits === 'undefined'){
                $scope.showRecipeTable = false;     //hide recipe table
                $scope.showErr = true;              //show error message
                $scope.ErrMessage = "No Recipes Found.";
            }else{
                $scope.showErr = false;     //hide error message if not already
                $scope.showRecipeTable = true;      //display recipe table
                //populate recipes[] with results and display in table
                for(var i=0; i<response.data.hits.length; i++){

                    $scope.recipes[i] = response.data.hits[i].recipe

                }
            }
        }, function myError(response) {

            $scope.message = response.statusText;

        });
    }
    //on recipe click from table, route to individual recipe page.  Pass selected recipe data
    $scope.goToRecipe = function(x) {
        recipePassService.set(x);
        $location.path('/recipe');
    }



});
//service to pass recipe data between pages
app.factory('recipePassService', function() {
    var passedRecipe = {};
    function set(recipe) {
        passedRecipe = recipe;
    }
    function get() {
        return passedRecipe;
    }
    return {
        set : set,
        get : get
    }
});
//service to keep recipe table between pages
app.factory('recipeKeepService', function() {
    var keptRecipes = [];
    function set(recipes) {
        keptRecipes = recipes;
    }
    function get() {
        return keptRecipes;
    }
    return {
        set : set,
        get : get
    }
});
//service to keep ingredient list between pages
app.factory('ingredientKeepService', function() {
    var keptIngredients = [];
    function set(ingredients) {
        keptIngredients = ingredients;
    }
    function get() {
        return keptIngredients;
    }
    return {
        set : set,
        get : get
    }
});
//individual recipe page controller
app.controller('recipePageController', function($scope, recipePassService) {
    //get selected recipe from service to populate page content
    $scope.recipe = recipePassService.get();
});
