'use strict';

const equal = require('deep-equal');
const strtok = require('locutus/php/strings/strtok');
const rtrim = require('locutus/php/strings/rtrim');
const preg_quote = require('locutus/php/pcre/preg_quote');
const str_replace = require('locutus/php/strings/str_replace');
const ksort = require('locutus/php/array/ksort');
const parse_url = require('locutus/php/url/parse_url');
const parse_str = require('locutus/php/strings/parse_str');
const array_merge = require('locutus/php/array/array_merge');

class PermissionMatcher {
    constructor() {
    }

    /**
     * Get a list of privileges for matching authz groups
     *
     * @public
     * @param  {object} permissions
     * @param  {array}  authzGroups
     * @return {array}
     */
    match (permissions, authzGroups) {
        const privileges = [];
        
        for (let permissionAuthzGroup in permissions) {
            const permissionPrivileges = permissions[permissionAuthzGroup];

            this.hasMatchingAuthzGroup(permissionAuthzGroup, authzGroups, (matches) => {
                if (!matches) return;
                privileges.push(permissionPrivileges);
            });
        };

        return this.flatten(privileges);
    }

    /**
     * Check if one of the authz groups match
     *
     * @protected
     * @param {string}   permissionAuthzGroup
     * @param {array}    authzGroups
     * @param {function} callback
     */
    hasMatchingAuthzGroup (permissionAuthzGroup, authzGroups, callback) {
        authzGroups.forEach((authzGroup) => {
            if (this.authzGroupsAreEqual(permissionAuthzGroup, authzGroup)) {
                return callback(true);
            }
        });

        callback(false);
    }

    /**
     * Check if authz groups match
     *
     * @protected
     * @param  {string}  permissionAuthzGroup
     * @param  {string}  authzGroup
     * @return {boolean}
     */
    authzGroupsAreEqual (permissionAuthzGroup, authzGroup) {
        return this.pathsAreEqual(permissionAuthzGroup, authzGroup) && 
            this.queryParamsAreEqual(permissionAuthzGroup, authzGroup);
    }

    /**
     * Compare the paths of two authz groups
     *
     * @protected
     * @param  {string}  permissionAuthzGroup
     * @param  {string}  authzGroup
     * @return {boolean}
     */
    pathsAreEqual (permissionAuthzGroup, authzGroup) {
        const permissionAuthzGroupPath = rtrim(strtok(permissionAuthzGroup, '?'), '/');
        const authzGroupPath = rtrim(strtok(authzGroup, '?'), '/');
        return this.matchAuthzGroupPaths(permissionAuthzGroupPath, authzGroupPath) ||
            this.matchAuthzGroupPaths(authzGroupPath, permissionAuthzGroupPath);
    }

    /**
     * Check if one paths mathes the other 
     *
     * @protected
     * @param  {string}  pattern
     * @param  {string}  subject
     * @return {boolean}
     */
    matchAuthzGroupPaths (pattern, subject) {
        let regex = '^' + str_replace('[^/]+', '\\*', preg_quote(pattern, '~')) + '$';
        regex = str_replace('\\*', '(.*)', regex);
        regex = new RegExp(regex, 'i');
        
        const invert = pattern.startsWith('!');
        const match = subject.match(regex);
        
        return invert ? !match : match;
    }

    /**
     * Compare the query parameters of two authz groups
     *
     * @protected
     * @param  {string}  permissionAuthzGroup
     * @param  {string}  authzGroup
     * @return {boolean}
     */
    queryParamsAreEqual (permissionAuthzGroup, authzGroup) {
        let authzGroupQueryParams = this.lowerCaseObjectKeys(this.getStringQueryParameters(authzGroup), 'CASE_LOWER');
        let permissionAuthzGroupQueryParams = this.lowerCaseObjectKeys(this.getStringQueryParameters(permissionAuthzGroup), 'CASE_LOWER');
        ksort(authzGroupQueryParams);
        ksort(permissionAuthzGroupQueryParams);
        return equal(permissionAuthzGroupQueryParams, authzGroupQueryParams);
    }

    /**
     * Get the query parameters used in a string
     *
     * @protected
     * @param  {string} string
     * @return {array}
     */
    getStringQueryParameters (string) {
        const query = parse_url(string, 'PHP_URL_QUERY');
        const params = [];
        if (query) parse_str(query, params);
        return params;
    }

    /**
     * Turn a 2 dimensional privilege array into a list of privileges
     *
     * @protected
     * @param  {array} input
     * @return {array}
     */
    flatten (input) {
        let list = [];

        input.forEach((item) => {
            list = array_merge(list, [].concat(item));
        });

        return [...new Set(list)];
    }

    /**
     * Lowercases the keys of an object
     *
     * @protected
     * @param  {object} object
     * @return {array}
     */
    lowerCaseObjectKeys (object) {
       let key, keys = Object.keys(object);
       let n = keys.length;
       let newObject = {}

       while (n--) {
           key = keys[n];
           newObject[key.toLowerCase()] = object[key];
       }

       return newObject;
    }
}

module.exports = PermissionMatcher;
