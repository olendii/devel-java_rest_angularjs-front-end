'use strict';

angular.module('trainer-ui')
    .controller('BranchFormController',
        ['$scope', 'CrudService', '$uibModalInstance', 'params', 'mainConfig',
            function ($scope, CrudService, $uibModalInstance, params, mainConfig) {

                var self = this;
                $scope.header = params.header;

                if (params.hasOwnProperty('question')) { $scope.question = params.question; }

                if (params.hasOwnProperty('id')) {
                    if (params.id === null) {
                        self.nullBranch = {
                            id: null,
                            name: '',
                            enabled: false
                        };
                        $scope.branch = self.nullBranch;
                    }
                    else {
                        fetchBranch(params.id);
                    }
                }

                function fetchBranch(id) {
                    CrudService.fetch(mainConfig.BRANCH_PARTIAL_URI, id)
                        .then(
                            function (d) {
                                $scope.branch = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching Branch');
                            }
                        );
                }

                $scope.submit = function () {
                    $uibModalInstance.close($scope.branch);
                };

                $scope.ok = function () {
                    $uibModalInstance.close($scope.branch);
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]);