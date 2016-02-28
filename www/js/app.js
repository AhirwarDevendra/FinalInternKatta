// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('InternKatta', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home',{
      url:'/home',
      templateUrl:'templates/home.html',
      controller:"HomeController"
    })
    .state('find',{
      url:'/find',
      templateUrl:'templates/findOption.html',
      controller:'FindOptionController'
    }) 
    .state('internshiplist',{
      url:'/internshiplist',
      templateUrl:'templates/internshiplist.html',
      controller:'InternshiplistController'
    })
    .state('findinternship',{
      url:'/findinternship/:InternshipID/:DevID',
      templateUrl:'templates/internship.html',
      controller:'ViewInternshipController'
    })
    
    
    
    $urlRouterProvider.otherwise("/home");
    
    
}])

.controller('NavCtrl', ['$scope','$ionicSideMenuDelegate',function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.exitapp = function () {  
    //document.addEventListener("backbutton",onBackKeyDown,false);
    //function onBackKeyDown(){
      //alert('fsd');
      //ionic.Platform.exitApp();
        navigator.notification.confirm(
          'Exit Internkatta ?'
        , function(button) {
              if (button == 2) {
                  navigator.app.exitApp();
              } 
          }
        , 'Exit'
        , 'No,Yes'
        );  
      //}
  };
}])

.controller('HomeController', ['$scope','$ionicPlatform','$ionicSideMenuDelegate',function($scope,$ionicPlatform, $ionicSideMenuDelegate) {
  //alert('hi');loginController
  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="home"){
      navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);
}])

.controller('FindOptionController', ['$scope','$http','$timeout','$state','$ionicModal','$ionicPopover','$ionicSideMenuDelegate',function($scope,$http, $timeout,$state, $ionicModal,$ionicPopover, $ionicSideMenuDelegate) {
  $scope.onPop = function($event) {
    $scope.popover.show($event);
  };
      $http.get("jsondata/city.json")
      .success(function (response) 
      {
       $scope.city = response;
      });  
      $http.get("jsondata/functionalarea.json")
      .success(function (response) 
      {
       $scope.functionalarea = response;
      });  
      $http.get("jsondata/category.json")
      .success(function (response) 
      {
       $scope.category = response;
      });  

      $scope.frm = {};

      $scope.findInternss = function($param){
        var optionsCSV = '';
        $scope.category.forEach(function(option) {

          if (option.value) {

            // If this is not the first item
            if (optionsCSV) {
              optionsCSV += ','
            }
            optionsCSV += option.Category_Name;
          }

        })
        // Save the csv to your db (replace alert with your code)
        alert($param.CityName+' '+$param.FunctionalArea+' '+optionsCSV);
        
        window.localStorage['InternshipOptionCity'] = $param.CityName;
        window.localStorage['InternshipOptionFunctionArea'] = $param.FunctionalArea;
        window.localStorage['InternshipOptionCategory'] = optionsCSV;
        
        if($param.CityName == null || $param.FunctionalArea == null || optionsCSV=="")
        {
            alert("Please Select Inputs For the Result");
        }
        else
        {

            $state.go('internshiplist');
        }
        
        
            /*var request = $http({
                method: "post",
                url: "php/findIntern.php",
                data: {
                    CityName: $param.CityName,
                    FunctionalArea: $param.FunctionalArea,
                    options : optionsCSV
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            /* Check whether the HTTP Request is Successfull or not. *
            request.success(function (data) {
                $scope.message = "From PHP file : "+data;
                //window.location.href('findinternshipresult.html');
            });        
            $log.info($param);
            $http.post('php/findIntern.php',{'city':$param.city,'selectedArea':$param.selectedArea,'Category_Name':optionsCSV})
            .success(function(data){
              alert('success'+$param.city);
            })
            .error(function(err){
              alert('failure');
            });*/
      }
}])

.controller('InternshiplistController',['$scope','$ionicSideMenuDelegate','$firebaseArray',function($scope, $ionicSideMenuDelegate,$firebaseArray) {
        console.log("Home Controller");

    var ref = new Firebase("https://devintern.firebaseio.com/internships");


    var City = window.localStorage['InternshipOptionCity'];
    //console.log(city);
    var FArea = window.localStorage['InternshipOptionFunctionArea'];
    var Category = window.localStorage['InternshipOptionCategory'];


    //$scope.InternshipList = $firebaseArray(ref);
    


    
    

    //$scope.InternshipList = $firebaseArray(ref);
    //$scope.InternshipList = $firebaseArray(ref.orderByChild('CityID').equalTo(city));
    $scope.InternshipList = $firebaseArray(ref.orderByChild('CityID').equalTo(City) && ref.orderByChild('FunctionAreaID').equalTo(FArea) && ref.orderByChild('CategoryID').equalTo(Category));

    $scope.city = window.localStorage['InternshipOptions'];
    console.log($scope.InternshipList);
    console.log($firebaseArray(ref).length);
    
    //$scope.Internships = $scope.InternshipList.length;

   $scope.Internships = 10;
  
      

  $scope.Internships = $scope.InternshipList.length;
}])


.controller('ViewInternshipController', ['$scope','$ionicModal','$stateParams','$ionicSideMenuDelegate','$firebaseObject',function($scope,$ionicModal,$stateParams, $ionicSideMenuDelegate,$firebaseObject) {
  $ionicModal.fromTemplateUrl('models/mapview.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {

    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.showspin = function(){
    document.getElementById('spin').style.display = "block";
  }
//alert('hi view '+$stateParams.InternshipID);
  console.log($stateParams.InternshipID);
    console.log($stateParams.DevID);
    
    $scope.getID = $stateParams.InternshipID ;
    var ref = new Firebase("https://devintern.firebaseio.com/internships/"+$scope.getID);
    
    
    var internshipData = $firebaseObject(ref);

    console.log(internshipData);
    internshipData.$bindTo($scope,"InternshipData");

}])