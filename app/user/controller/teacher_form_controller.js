'use strict';

angular.module('trainer-ui')
    .controller('TeacherFormController',
        ['$scope', 'CrudService', '$uibModalInstance', 'params', 'mainConfig',
            function ($scope, CrudService, $uibModalInstance, params, mainConfig) {

                var self = this;
                $scope.header = params.header;
                if (params.hasOwnProperty('question')) { $scope.question = params.question; }

                $scope.allBranches = [];
                if (params.hasOwnProperty('branches')) { $scope.allBranches = params.branches; }

                if (params.hasOwnProperty('id')) {
                    if (params.id === null) {
                        self.nullTeacher = {
                            id: null,
                            name: '',
                            login: '',
                            password: '',
                            email: '',
                            phone: '',
                            note: '',
                            branch_id: null,
                            enabled: false
                        };
                        $scope.teacher = self.nullTeacher;
                    }
                    else {
                        fetchTeacher(params.id);
                    }
                }

                function fetchTeacher(id) {
                    CrudService.fetch(mainConfig.TEACHER_PARTIAL_URI, id)
                        .then(
                            function (d) {
                                $scope.teacher = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching Teacher');
                            }
                        );
                }

                $scope.submit = function () {
                    $uibModalInstance.close($scope.teacher);
                };

                $scope.ok = function () {
                    $uibModalInstance.close($scope.teacher);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);