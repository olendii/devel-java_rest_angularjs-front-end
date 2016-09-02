(function () {
    'use strict';

    angular.module('user_admin-ui', [
        'ngRoute',
        'ngTable',
        'ui.bootstrap'
    ])
        .constant("mainConfig", {
            "REST_SERVICE_URI": "http://useradmin.herokuapp.com/",
            "USER_PARTIAL_URI": "users",
            "ROLE_PARTIAL_URI": "roles",
            "BRANCH_PARTIAL_URI": "branches",
            "TEACHER_PARTIAL_URI": "teachers",
            "LEARNER_PARTIAL_URI": "learners",
            "TABLE_DEFAULT_COUNT": 5
        })
        .config(function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/common/view/main.html'//,
                    //controller: 'MainCtrl',
                    //controllerAs: 'mainCtrl'
                })
                .when('/users', {
                    templateUrl: '/user/view/user_list.html',
                    controller: 'UserListController',
                    controllerAs: 'usersCtrl'
                })
                .when('/branches', {
                    templateUrl: '/reference/view/branch_list.html',
                    controller: 'BranchListController',
                    controllerAs: 'branchesCtrl'
                })
                .when('/teachers', {
                    templateUrl: '/user/view/teacher_list.html',
                    controller: 'TeacherListController',
                    controllerAs: 'teachersCtrl'
                })
                .when('/learners', {
                    templateUrl: '/user/view/learner_list.html',
                    controller: 'LearnerListController',
                    controllerAs: 'learnersCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        });

}());