'use strict';

angular.module('trainer-ui')
    .controller('UserFormController',
        ['$scope', 'CrudService', '$uibModalInstance', 'params', 'mainConfig',
            function ($scope, CrudService, $uibModalInstance, params, mainConfig) {

                var self = this;
                $scope.header = params.header;
                if (params.hasOwnProperty('question')) { $scope.question = params.question; }

                $scope.allRoles = [];
                if (params.hasOwnProperty('roles')) { $scope.allRoles = params.roles; }

                if (params.hasOwnProperty('id')) {
                    if (params.id === null) {
                        self.nullUser = {
                            id: null,
                            name: '',
                            login: '',
                            password: '',
                            email: '',
                            phone: '',
                            note: '',
                            roles: [],
                            enabled: false
                        };
                        $scope.user = self.nullUser;
                    }
                    else {
                        fetchUser(params.id);
                    }
                }

                function fetchUser(id) {
                    CrudService.fetch(mainConfig.USER_PARTIAL_URI, id)
                        .then(
                            function (d) {
                                $scope.user = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching User');
                            }
                        );
                }

                $scope.submit = function () {
                    $uibModalInstance.close($scope.user);
                };

                $scope.ok = function () {
                    $uibModalInstance.close($scope.user);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);