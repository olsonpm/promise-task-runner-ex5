'use strict';

//---------//
// Imports //
//---------//

var ptr = require('promise-task-runner')
    , PromiseTask = ptr.PromiseTask
    , TaskDependency = ptr.TaskDependency
    , PromiseTaskContainer = ptr.PromiseTaskContainer
    , gulp = require('gulp')
    , bPromise = require('bluebird')
    , bFs = require('fs-bluebird')
    , bRimraf = bPromise.promisify(require('rimraf'));


//------//
// Init //
//------//

var ptc = new PromiseTaskContainer();


//-------//
// Tasks //
//-------//

var build = new PromiseTask()
    .id('build')
    .task(function() {
        var env = this.globalArgs().env;
        console.log('built ' + env);
    });
var test = new PromiseTask()
    .id('test')
    .task(function() {
        var env = this.globalArgs().env;
        console.log('tested ' + env);
    });
var preDeploy = new TaskDependency()
    .id('preDeploy')
    .task(function() {
        return build.run()
            .then(function() {
                return test.run()
            });
    });
var deploy = new PromiseTask()
    .id('deploy')
    .dependencies(preDeploy)
    .task(function() {
        var env = this.globalArgs().env;
        console.log('deployed ' + env);
    });

ptc.addTasks(build, test, deploy);


//---------//
// Exports //
//---------//

module.exports = ptc;
