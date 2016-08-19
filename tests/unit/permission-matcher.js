'use strict';

const assert = require('assert');
const PermissionMatcher = require('../../src/permission-matcher.js');
const matcher = new PermissionMatcher();

describe('PermissionMatcher', function() {
    describe('#match()', function() {
        it('should match string permissions', testMatchString);
        it('should match array permissions ', testMatchArray);
        it('should match nested permissions', testMatchNested);
        it('should match wildcards', testMatchWildcard);
        it('should match insensitive paths', testMatchCaseInsensitivePath);
        it('should match resources', testMatchResource);
        it('should match resources with query params', testMatchResourceWithQueryParams);
        it('should match resources with wildcard query params', testMatchWildcardResource);
        it('should match resources with insensitive query params', testMatchCaseInsensitiveQueryParams);
    });
});

function testMatchString () {
    let permissions = {
        'admin': 'write',
        'guest': 'read'
    };
    assert.deepEqual(matcher.match(permissions, ['admin']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['admin', 'foo']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['guest']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['foo']), []);
    assert.deepEqual(matcher.match(permissions, ['admin', 'guest']), ['write', 'read']);
}

function testMatchArray () {
    let permissions = {
        'admin': ['read', 'write'],
        'guest': ['read'],
        'owner': ['manage']
    };
    assert.deepEqual(matcher.match(permissions, ['admin']), ['read', 'write']);
    assert.deepEqual(matcher.match(permissions, ['admin', 'foo']), ['read', 'write']);
    assert.deepEqual(matcher.match(permissions, ['guest']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['foo']), []);
    assert.deepEqual(matcher.match(permissions, ['admin', 'guest', 'owner']), ['read', 'write', 'manage']);
}

function testMatchNested () {
    let permissions = {
        'admin': 'read',
        'admin.support': 'write',
        'admin.dev': 'develop'
    };
    assert.deepEqual(matcher.match(permissions, ['admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['admin.support']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['admin', 'admin.support']), ['read', 'write']);
}

function testMatchWildcard () {
    let permissions = {
        'admin': 'read',
        'admin.support': 'write',
        'admin.dev': 'develop',
        'admin.dev.tester': 'test',
        'guest': 'find',
        'guest.support': 'sing',
        '*.support': 'dance'
    };
    assert.deepEqual(matcher.match(permissions, ['admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['admin.*']), ['write', 'develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['admin.*.*']), ['test']);
    assert.deepEqual(matcher.match(permissions, ['admin', 'admin.*']), ['read', 'write', 'develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['admin.d*']), ['develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['admin.support']), ['write', 'dance']);
    assert.deepEqual(matcher.match(permissions, ['guest.support']), ['sing', 'dance']);
    assert.deepEqual(matcher.match(permissions, ['foo.support']), ['dance']);
    assert.deepEqual(matcher.match(permissions, ['*.support']), ['write', 'sing', 'dance']);
}

function testMatchCaseInsensitivePath () {
    let permissions = {
        'AdMiN': 'read'
    };
    assert.deepEqual(matcher.match(permissions, ['admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['ADMIN']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['AdMiN']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['aDmIn']), ['read']);
}

function testMatchResource () {
    let permissions = {
        '/admin': 'read',
        '/admin/support': 'write',
        '/admin/dev': 'develop',
        '/bar/': 'drink'
    };
    assert.deepEqual(matcher.match(permissions, ['/admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/admin/support']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['/admin', '/admin/support']), ['read', 'write']);
    assert.deepEqual(matcher.match(permissions, ['/admin/']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/admin/?']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/admin?']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/bar']), ['drink']);
}

function testMatchResourceWithQueryParams () {
    let permissions = {
        '/admin': 'read',
        '/admin?role=support': 'write',
        '/admin?role=dev': 'develop',
        '/admin?job=lawyer&from=amsterdam': 'party'
    };
    assert.deepEqual(matcher.match(permissions, ['/admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/admin?role=support']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['/admin', '/admin?role=support']), ['read', 'write']);
    assert.deepEqual(matcher.match(permissions, ['/admin?job=lawyer&from=amsterdam']), ['party']);
    assert.deepEqual(matcher.match(permissions, ['/admin?from=amsterdam&job=lawyer']), ['party']);
    assert.deepEqual(matcher.match(permissions, ['/admin/super?job=lawyer']), []);
    assert.deepEqual(matcher.match(permissions, ['/foo']), []);
}

function testMatchWildcardResource () {
    let permissions = {
        '/admin': 'read',
        '/admin/support': 'write',
        '/admin/dev': 'develop',
        '/admin/dev/tester': 'test',
        '/guest': 'find',
        '/guest/support': 'sing',
        '/*/support': 'dance'
    };
    assert.deepEqual(matcher.match(permissions, ['/admin']), ['read']);
    assert.deepEqual(matcher.match(permissions, ['/admin/*']), ['write', 'develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['/admin/*/*']), ['test']);
    assert.deepEqual(matcher.match(permissions, ['/admin', '/admin/*']), ['read', 'write', 'develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['/admin/d*']), ['develop', 'test']);
    assert.deepEqual(matcher.match(permissions, ['/admin/support']), ['write', 'dance']);
    assert.deepEqual(matcher.match(permissions, ['/guest/support']), ['sing', 'dance']);
    assert.deepEqual(matcher.match(permissions, ['/foo/support']), ['dance']);
    assert.deepEqual(matcher.match(permissions, ['/*/support']), ['write', 'sing', 'dance']);
}

function testMatchCaseInsensitiveQueryParams () {
    let permissions = {
        '/admin?ROlE=support': 'write',
        '/admin?Job=lawyer&FROM=amsterdam': 'party'
    };
    assert.deepEqual(matcher.match(permissions, ['/admin?role=support']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['/admin?RolE=support']), ['write']);
    assert.deepEqual(matcher.match(permissions, ['/admin?joB=lawyer&FroM=amsterdam']), ['party']);
}
