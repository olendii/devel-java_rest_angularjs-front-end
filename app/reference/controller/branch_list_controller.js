'use strict';

angular.module('user_admin-ui')
    .controller('BranchListController',
        ['$scope', '$filter', 'CrudService', 'NgTableParams', '$uibModal', 'mainConfig',
            function ($scope, $filter, CrudService, NgTableParams, $uibModal, mainConfig) {

                var self = this;
                self.branches = [];
                self.branchesTable = null;

                self.question = 'Удалить подразделение?';

                self.remove = remove;
                self.edit = edit;
                self.create = create;
                self.toggleActive = toggleActive;

                fetchAllBranches();

                function fetchAllBranches() {
                    CrudService.fetchAll(mainConfig.BRANCH_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.branches = d;
                                self.branchesTable = new NgTableParams(
                                    {
                                        page: 1,
                                        count: mainConfig.TABLE_DEFAULT_COUNT,
                                        sorting: {name: "asc"}
                                    },
                                    {
                                        total: self.branches.length,
                                        dataset: self.branches
                                    }
                                );
                            },
                            function (errResponse) {
                                console.error('Error while fetching Branches');
                            }
                        );

                }

                function createBranch(branch) {
                    CrudService.create(mainConfig.BRANCH_PARTIAL_URI, branch)
                        .then(
                            function () {
                                fetchAllBranches();
                            },
                            function (errResponse) {
                                console.error('Error while creating Branch');
                            }
                        );
                }

                function updateBranch(branch, id) {
                    CrudService.update(mainConfig.BRANCH_PARTIAL_URI, branch, id)
                        .then(
                            function () {
                                fetchAllBranches();
                            },
                            function (errResponse) {
                                console.error('Error while updating Branch');
                            }
                        );
                }

                function deleteBranch(id) {
                    CrudService.deleteById(mainConfig.BRANCH_PARTIAL_URI, id)
                        .then(
                            function () {
                                fetchAllBranches();
                            },
                            function (errResponse) {
                                console.error('Error while deleting Branch');
                            }
                        );
                }

                function remove(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'BranchFormController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Внимание!',
                                    question: self.question
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        deleteBranch(id);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });

                }

                function edit(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/reference/view/branch_form.html',
                        controller: 'BranchFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Изменение подразделения',
                                    id: id
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            updateBranch(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function create() {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/reference/view/branch_form.html',
                        controller: 'BranchFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Создание подразделения',
                                    id: null
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            createBranch(responce);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function toggleActive(id, enabled) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'BranchFormController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Внимание!',
                                    question: (enabled ? 'От' : 'В') + 'ключить подразделение?',
                                    id: id
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            responce.enabled = !enabled;
                            updateBranch(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

            }]);