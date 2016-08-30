'use strict';

angular.module('user_admin-ui')
    .controller('UserListController',
        ['$scope', '$filter', 'CrudService', 'NgTableParams', '$uibModal', 'mainConfig',
            function ($scope, $filter, CrudService, NgTableParams, $uibModal, mainConfig) {

                var self = this;
                self.users = [];
                self.usersTable = null;

                self.roles = [];

                self.question = 'Удалить пользователя?';

                self.remove = remove;
                self.edit = edit;
                self.create = create;
                self.toggleActive = toggleActive;

                fetchAllRoles();
                fetchAllUsers();

                function fetchAllRoles() {
                    CrudService.fetchAll(mainConfig.ROLE_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.roles = d;
                            },
                            function (errResponse) {
                                console.error('Error while fetching Roles');
                            }
                        );

                }

                function fetchAllUsers() {
                    CrudService.fetchAll(mainConfig.USER_PARTIAL_URI)
                        .then(
                            function (d) {
                                self.users = d;
                                self.usersTable = new NgTableParams(
                                    {
                                        page: 1,
                                        count: mainConfig.TABLE_DEFAULT_COUNT,
                                        sorting: {name: "asc"}
                                    },
                                    {
                                        total: self.users.length,
                                        dataset: self.users
                                    }
                                );
                            },
                            function (errResponse) {
                                console.error('Error while fetching Users');
                            }
                        );

                }

                function createUser(user) {
                    CrudService.create(mainConfig.USER_PARTIAL_URI, user)
                        .then(
                            function () {
                                fetchAllUsers();
                            },
                            function (errResponse) {
                                console.error('Error while creating User');
                            }
                        );
                }

                function updateUser(user, id) {
                    CrudService.update(mainConfig.USER_PARTIAL_URI, user, id)
                        .then(
                            function () {
                                fetchAllUsers();
                            },
                            function (errResponse) {
                                console.error('Error while updating User');
                            }
                        );
                }

                function deleteUser(id) {
                    CrudService.deleteById(mainConfig.USER_PARTIAL_URI, id)
                        .then(
                            function () {
                                fetchAllUsers();
                            },
                            function (errResponse) {
                                console.error('Error while deleting User');
                            }
                        );
                }

                function remove(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'UserFormController',
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
                        deleteUser(id);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });

                }

                function edit(id) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/user_form.html',
                        controller: 'UserFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Изменение пользователя',
                                    id: id,
                                    roles: self.roles
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            updateUser(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function create() {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/user/view/user_form.html',
                        controller: 'UserFormController',
                        size: '',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Создание пользователя',
                                    id: null,
                                    roles: self.roles
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            createUser(responce);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

                function toggleActive(id, enabled) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '/common/view/modal.html',
                        controller: 'UserFormController',
                        size: 'sm',
                        resolve: {
                            params: function () {
                                return {
                                    header: 'Внимание!',
                                    question: (enabled ? 'От' : 'В') + 'ключить пользователя?',
                                    id: id
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (responce) {
                            responce.enabled = !enabled;
                            updateUser(responce, id);
                        },
                        function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                }

            }]);