'use strict';

angular.module('user_admin-ui').factory('CrudService', ['$http', '$q', 'mainConfig', function ($http, $q, mainConfig) {

    var factory = {
        fetchAll: fetchAll,
        fetch: fetch,
        create: create,
        update: update,
        deleteById: deleteById
    };

    return factory;

    function fetchAll(partial_path) {
        var deferred = $q.defer();
        $http.get(mainConfig.REST_SERVICE_URI + partial_path)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function fetch(partial_path, id) {
        var deferred = $q.defer();
        $http.get(mainConfig.REST_SERVICE_URI + partial_path + "/" + id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function create(partial_path, object) {
        var deferred = $q.defer();
        $http.post(mainConfig.REST_SERVICE_URI + partial_path, object)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function update(partial_path, object, id) {
        var deferred = $q.defer();
        $http.put(mainConfig.REST_SERVICE_URI + partial_path + "/" + id, object)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

    function deleteById(partial_path, id) {
        var deferred = $q.defer();
        $http.delete(mainConfig.REST_SERVICE_URI + partial_path + "/" + id)
            .then(
                function (response) {
                    deferred.resolve(response.data);
                },
                function (errResponse) {
                    deferred.reject(errResponse);
                }
            );
        return deferred.promise;
    }

}]);