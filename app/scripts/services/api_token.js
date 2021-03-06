/*
  Copyright (c) 2013 Ankur Sethi <contact@ankursethi.in>
  Licensed under the terms of the MIT license.
  See the file LICENSE for copying permissions.
*/


//
// The ApiToken service takes care of all our authentication needs. It is
// responsible for logging in, logging out and managing API tokens in
// localStorage.
//
angular.module('SecondhandApp')
  .factory('ApiToken', ['$http', '$rootScope', 'Config', function ($http, $rootScope, Config) {
    'use strict';

    var ApiToken = {};

    ApiToken.haveToken = function () {
      return localStorage.getItem('apiToken') !== null;
    };

    ApiToken.setAuthorizationHeaders = function(token) {
      $http.defaults.headers.common['Authorization'] = 'Token ' + token;
    };

    ApiToken.clearAuthorizationHeaders = function() {
      $http.defaults.headers.common['Authorization'] = undefined;
    };

    ApiToken.storeToken = function(data) {
      localStorage.setItem('apiToken', data.token);
      ApiToken.setAuthorizationHeaders(data.token);
    };

    ApiToken.clearToken = function() {
      localStorage.removeItem('apiToken');
      ApiToken.clearAuthorizationHeaders();
    };

    ApiToken.getToken = function() {
      return localStorage.getItem('apiToken');
    };

    ApiToken.storeUsername = function(username) {
      localStorage.setItem('username', username);
    };

    ApiToken.clearUsername = function() {
      localStorage.removeItem('username');
    };

    ApiToken.getUsername = function() {
      return localStorage.getItem('username');
    };

    ApiToken.requestApiToken = function (credentials) {
      $http.post(Config.BASE_API_URL + 'token', {
        username: credentials.username,
        password: credentials.password
      })
        .success(function (data, status) {
          if (status === 201) {
            ApiToken.storeToken(data);
            ApiToken.storeUsername(credentials.username);
            $rootScope.$broadcast('logged_in');
          }
        });
    };

    ApiToken.logout = function() {
      // TODO: this should delete the session on the server.
      ApiToken.clearToken();
      ApiToken.clearUsername();
    };

    return ApiToken;
  }]);
