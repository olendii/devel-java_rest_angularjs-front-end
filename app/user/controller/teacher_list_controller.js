'use strict';

angular.module('user_admin-ui')
    .controller('TeacherListController',
        ['$scope', '$filter', 'CrudService', 'NgTableParams', '$uibModal', 'mainConfig',
            function ($scope, $filter, CrudService, NgTableParams, $uibModal, mainConfig) {

                var self = this;
                self.teachers = [];
                self.teachersTable = null;

                self.branches = [];

                self.question = 'Удалить преподавателя?';

                self.remove = remove;
                self.edit = edit;
                self.create = create;
                self.toggleActive = toggleActive;

                fetchAllBranches();
                fetchAllTeachers();

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

                function fetchAllTeachers() {
                    CrudService.fetchAll(mainConfig.TEACHER_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.teachers = d;
                                self.teachersTable = new NgTableParams(
                                    {
                                        page: 1,
                                        count: mainConfig.TABLE_DEFAULT_COUNT,
                                        sorting: {name: "asc"}
                                    },
                                    {
                                        total: self.teachers.length,
                                        dataset: self.teachers
                                    }
                                );
                            },
                            function (errResponse) {
                                console.error('Error while fetching Teachers');
                            }
                        );

                }

                function createTeacher(teacher) {
                    CrudService.create(mainConfig.TEACHER_PARTIAL_URI, teacher)
                        .then(
                            function () {
                                fetchAllTeachers();
                            },
                            function (errResponse) {
                                console.error('Error while creating Teacher');
                            }
                        );
                }

                function updateTeacher(teacher, id) {
                    CrudService.update(mainConfig.TEACHER_PARTIAL_URI, teacher, id)
                        .then(
                            function () {
                                fetchAllTeachers();
                            },
                            function (errResponse) {
                                console.error('Error while updating Teacher');
                            }
                        );
                }

                function deleteTeacher(id) {
                    CrudService.deleteById(mainConfig.TEACHER_PARTIAL_URI, id)
                        .then(
                            function () {
                                fetchAllTeachers();
                            },
                            function (errResponse) {
                                console.error('Error while deleting Teacher');
                            }
                        );
                }

                function remove(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'TeacherFormController',
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
                        deleteTeacher(id);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });

                }

                function edit(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/teacher_form.html',
                        controller: 'TeacherFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Изменение преподавателя',
                                    id: id,
                                    branches: self.branches
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            updateTeacher(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function create() {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/teacher_form.html',
                        controller: 'TeacherFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Создание преподавателя',
                                    id: null,
                                    branches: self.branches
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            createTeacher(responce);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function toggleActive(id, enabled) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'TeacherFormController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Внимание!',
                                    question: (enabled ? 'От' : 'В') + 'ключить преподавателя?',
                                    id: id
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            responce.enabled = !enabled;
                            updateTeacher(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

            }]);