'use strict';

angular.module('trainer-ui')
    .controller('LearnerFormController',
        ['$scope', 'CrudService', '$uibModalInstance', 'params', 'mainConfig',
            function ($scope, CrudService, $uibModalInstance, params, mainConfig) {

                var self = this;
                $scope.header = params.header;
                if (params.hasOwnProperty('question')) { $scope.question = params.question; }

                $scope.allBranches = [];
                if (params.hasOwnProperty('branches')) { $scope.allBranches = params.branches; }

                if (params.hasOwnProperty('id')) {
                    if (params.id === null) {
                        self.nullLearner = {
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
                        $scope.learner = self.nullLearner;
                    }
                    else {
                        fetchLearner(params.id);
                    }
                }

                function fetchLearner(id) {
                    CrudService.fetch(mainConfig.LEARNER_PARTIAL_URI, id)
                        .then(
                            function (d) {
                                $scope.learner = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching Learner');
                            }
                        );
                }

                $scope.submit = function () {
                    $uibModalInstance.close($scope.learner);
                };

                $scope.ok = function () {
                    $uibModalInstance.close($scope.learner);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);