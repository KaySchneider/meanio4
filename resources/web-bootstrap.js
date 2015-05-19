'use strict';
/* global jQuery:true */

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, ['mean']);

});

function processModules(modules) {
    var packageModules = ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router'],m,mn;
    for (var index in modules) {
        m = modules[index];
        mn = 'mean.'+m.name;
        angular.module(mn, m.angularDependencies || []);
        packageModules.push(mn);
    }

    angular.module('mean', packageModules);
}

jQuery.ajax('/_getModules', {
    dataType: 'json',
    async:false,
    success: processModules
});

'use strict';

var mean = require('../../index.js'),
    should = require('should');

/* jshint -W030 */
describe('mean.js', function() {

    it('exports an object', function() {
        should.exist(mean);
        mean.should.be.an.Object;
    });

    var menus;
    before(function() {
        menus = new mean.Menus();
    });
    it('creates an empty menu array', function() {
        menus.get().should.be.an.Array.and.be.empty;
    });

    it('adds a menu', function() {
        menus.add({
            title: 'test'
        });

        menus.get().should.eql([{
            title: 'test',
            name: 'test',
            icon : null,
            link: null,
            roles: ['anonymous'],
            submenus:[],
        }]);
    });

    it('adds 2 menus', function() {
        menus.get().should.be.an.Array.and.have.length(1); // 1 anonymous
        menus.add({
            title: 'auth',
            roles: ['authenticated']
        }, {
            title: 'mocha',
            roles: ['mocha']
        });

        //since user is authenticated, the menu for anonymous wont be shown to him
        menus.get({
            roles: ['authenticated']
        }).should.be.an.Array.and.have.length(1); //authenticated

        menus.get({
            roles: ['mocha']
        }).should.be.an.Array.and.have.length(2); //authenticated and mocha
    });

    //anonymous is anonymous, authenticated is authenticated ... If you need a submenu
    //item for everybody, add submenu item for role 'all'
    it('add menu item for ALL users', function () {
        menus.get().should.be.an.Array.and.have.length(1); //anonymous
        menus.add({
            title:'check_all',
            roles:['all']
        });

        menus.get().should.be.an.Array.and.have.length(2); //anonymous and all
        menus.get({roles:['mocha']}).should.be.an.Array.and.have.length(3); //authenticated, mocha and all
        menus.get({roles:['authenticated']}).should.be.an.Array.and.have.length(2); //authenticated and all

        menus.add({
            title:'check_all2',
            roles:null
        });

        menus.get().should.be.an.Array.and.have.length(3); //anonymous and all
        menus.get({roles:['mocha']}).should.be.an.Array.and.have.length(4); //authenticated, mocha and all
        menus.get({roles:['authenticated']}).should.be.an.Array.and.have.length(3); //authenticated and all

    });

    it('properly weight js footer menus', function(done) {
        mean.aggregated('js', 'footer', function(aggr) {
            aggr.should.be.empty;
            done();
        });
    });
});
