'use strict';

angular.module('user_admin-ui')
    .controller('LearnerListController',
        ['$scope', '$filter', 'CrudService', 'NgTableParams', '$uibModal', 'mainConfig',
            function ($scope, $filter, CrudService, NgTableParams, $uibModal, mainConfig) {

                var self = this;
                self.learners = [];
                self.learnersTable = null;

                self.branches = [];

                self.question = 'Удалить ученика?';

                self.remove = remove;
                self.edit = edit;
                self.create = create;
                self.toggleActive = toggleActive;

                fetchAllBranches();
                fetchAllLearners();

                function fetchAllBranches() {
                    CrudService.fetchAll(mainConfig.BRANCH_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.branches = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching Branches');
                            }
                        );

                }

                function fetchAllLearners() {
                    CrudService.fetchAll(mainConfig.LEARNER_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.learners = d;
                                self.learnersTable = new NgTableParams(
                                    {
                                        page: 1,
                                        count: mainConfig.TABLE_DEFAULT_COUNT,
                                        sorting: {name: "asc"}
                                    },
                                    {
                                        total: self.learners.length,
                                        dataset: self.learners
                                    }
                                );
                            },
                            function (errResponse) {
                                console.error('Error while fetching Learners');
                            }
                        );

                }

                function createLearner(learner) {
                    CrudService.create(mainConfig.LEARNER_PARTIAL_URI, learner)
                        .then(
                            function () {
                                fetchAllLearners();
                            },
                            function (errResponse) {
                                console.error('Error while creating Learner');
                            }
                        );
                }

                function updateLearner(learner, id) {
                    CrudService.update(mainConfig.LEARNER_PARTIAL_URI, learner, id)
                        .then(
                            function () {
                                fetchAllLearners();
                            },
                            function (errResponse) {
                                console.error('Error while updating Learner');
                            }
                        );
                }

                function deleteLearner(id) {
                    CrudService.deleteById(mainConfig.LEARNER_PARTIAL_URI, id)
                        .then(
                            function () {
                                fetchAllLearners();
                            },
                            function (errResponse) {
                                console.error('Error while deleting Learner');
                            }
                        );
                }

                function remove(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'LearnerFormController',
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
                        deleteLearner(id);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });

                }

                function edit(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/learner_form.html',
                        controller: 'LearnerFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Изменение ученика',
                                    id: id,
                                    branches: self.branches
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            updateLearner(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function create() {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/learner_form.html',
                        controller: 'LearnerFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Создание ученика',
                                    id: null,
                                    branches: self.branches
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            createLearner(responce);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function toggleActive(id, enabled) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'LearnerFormController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Внимание!',
                                    question: (enabled ? 'От' : 'В') + 'ключить ученика?',
                                    id: id
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            responce.enabled = !enabled;
                            updateLearner(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

            }]);