/**
 * Routes for express app
 */
var express = require('express');
// var _ = require('lodash');
var path = require('path');
// var utils = require('../utils');

var constants = require('./const');

var isDev = process.env.NODE_ENV === 'development';

// var service = require('../services/service');
// var fs = require('fs');
// var uaparser = require('ua-parser-js');
// var compiled_app_module_path = path.resolve(__dirname, '../../', 'public', 'assets', 'server.js');
// var App = require(compiled_app_module_path);

module.exports = function(app) {

    // =====================================
    // API =================================
    // =====================================
    // app.get('/createshare/:name/:gift/:count/:line', function(req, res, next){
    //   var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //   console.log("ip: " + ip);
    //   if(ip.search("127.0.0.1") >= 0 || ip.search("0.0.0.0") >= 0){
    //     res.render(path.resolve(__dirname, '../', 'views/bingo/createshare.ejs'), {
    //       name: decodeURIComponent(req.params.name),
    //       gift: req.params.gift == "0"? false : decodeURIComponent(req.params.gift),
    //       correctCount: req.params.count,
    //       lineCount: req.params.line
    //     } );
    //   }
    // });

    // =====================================
    // CONSOLE =============================
    // =====================================
    app.get('/console', function (req, res, next) {
        res.render(path.resolve(__dirname, '../', 'views/console.ejs'), {});
    });

    // =====================================
    // RATINGS =============================
    // =====================================
    app.get('/ratings/:number', function (req, res, next) {
        var num = req.params.number;
        var ratings = constants.ratings;
        if(isNaN(num) || num <= 0 || num > ratings.length){
            res.status(404);
        }else{
            res.render(path.resolve(__dirname, '../', 'views/ratings.ejs'), {
                info: ratings[num - 1], 
                idx: num - 1,
                maxScore: constants.maxScore
            });
        }
    });


    // app.get('/', function (req, res, next) {
    //     res.render(path.resolve(__dirname, '../', 'views/index.ejs'));
    // });
    // show the login form
    // app.get('/login', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render(path.resolve(__dirname, '../', 'views/login.ejs'));
    // });

    // app.get('/signup', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render(path.resolve(__dirname, '../', 'views/signup.ejs'), { message: req.flash('signupMessage') });
    // });


    // app.get('/create/project', loginRequired, function (req, res, next) {
    //     res.render(path.resolve(__dirname, '../', 'views/createProject.ejs'));
    //     // req.session.project = 1;
    // });

    // app.post('/create/project/add', loginRequired, function(req, res, next){
    //     var formbody = req.body;
    //     var userId = req.user;

    //     interface.addProject(formbody.projectName, userId, formbody.description, formbody.license)
    //         .then(
    //             function(result){
    //                 req.session.project = parseInt(result.id);
    //                 // console.log(result);
    //                 res.redirect('/project/' + result.id + '/precommit');
    //                 // res.status(200).send("OK");
    //             },
    //             function(err){
    //                 res.status(500).json({error: "Internal server error: " + err});
    //             }
    //         );
    // });

    // app.get('/project/:id/precommit', loginRequired, function (req, res, next) {
    //     res.render(path.resolve(__dirname, '../', 'views/precommit.ejs'), { project: req.params.id });
    // });

    // app.get('/project/:id/commits', function(req, res, next){
    //     var id = req.params.id;
    //     if(!id || isNaN(id)) res.status(404);
    //     else{
    //         interface.getCommits(parseInt(id))
    //             .then(
    //                 function(results){
    //                     // to return
    //                     var appendUrl = req.user? ("/project/" + id + "/precommit") : "";
    //                     var removeBase = req.user? ("/project/" + id + "/commit/") : "";
    //                     res.render(path.resolve(__dirname, '../', 'views/commitList.ejs'), { itemsStr: JSON.stringify(results || []), appendUrl: appendUrl, removeBase: removeBase } );
    //                 },
    //                 function(err){ res.status(500).json({error: "Internal server error: " + err}); }
    //             );
    //     }
    // });

    // app.post('/project/:id/push', loginRequired, function(req, res, next){
    //     var userId = req.user;
    //     var id = req.params.id;
    //     if(!id || isNaN(id)) res.status(404);
    //     else{
    //         interface.pushCommits(id, req.body.commits)
    //             .then(function(result){ res.status(200).json({ status: "OK" }); })
    //             .catch(function(err){ res.status(500).json({error: "Internal server error: " + err}); });
    //     }
    // });

    // // for single commit save
    // app.post('/project/:id/commit', loginRequired, function(req, res, next){
    //     var userId = req.user;
    //     var id = req.params.id;
    //     if(!id || isNaN(id)) res.status(404);
    //     else{
    //         var commit = req.body;

    //         commit.project_id = id;
    //         commit.user_id = userId;
    //         interface.addCommit(commit)
    //             .then(function(result){ res.status(200).json({ status: "OK", data: result }); })
    //             .catch(function(err){ res.status(500).json({error: "Internal server error: " + err}); });
    //     }
    // });

    // // for single commit remove
    // app.delete('/project/:pid/commit/:cid', loginRequired, function(req, res, next){
    //     var userId = req.user;
    //     var pid = req.params.pid;
    //     var cid = req.params.cid;
    //     if(!pid || isNaN(pid)) res.status(404);
    //     else{
    //         interface.removeCommit(pid, cid)
    //             .then(function(result){ res.status(200).json({ status: "OK", data: result }); })
    //             .catch(function(err){ res.status(500).json({error: "Internal server error: " + err}); });
    //     }
    // });

    // // for batch commits
    // app.post('/project/:id/commits', loginRequired, function(req, res, next){
    //     var userId = req.user;
    //     var id = req.params.id;
    //     if(!id || isNaN(id)) res.status(404);
    //     else{
    //         var items = req.body;

    //         Promise.all(
    //             items.map(function(commit){
    //                 commit.project_id = id;
    //                 commit.user_id = userId;
    //                 return interface.addCommit(commit);
    //             })
    //         )
    //         .then(function(){ res.status(200).json({ status: "OK" }); })
    //         .catch(function(err){ res.status(500).json({error: "Internal server error: " + err}); });
    //     }
    // });

    // app.get('/projects', function (req, res, next) {
    //     res.render(path.resolve(__dirname, '../', 'views/projectList.ejs'), { getUrl: '/projects/json' } ); 
    // });

    // app.get('/projects/json', function (req, res, next) {
    //     var idx = req.query.idx;
    //     var len = req.query.len;
    //     interface.getAllProjects(idx, len)
    //         .then(
    //             function(results){
    //                 var userId = req.user;
    //                 if(userId) {    // if login
    //                     results.forEach(function(item){ 
    //                         if(item.user_id == userId) item.appendUrl = "/project/" + item.id + "/precommit";
    //                     });
    //                 }
    //                 res.status(200).json({ items: results });
    //             },
    //             function(err){ res.status(500).json({error: "Internal server error: " + err}); }
    //         );
    // });

    // app.get('/user/projects', loginRequired, function (req, res, next) {
    //     res.render(path.resolve(__dirname, '../', 'views/projectList.ejs'), { getUrl: '/user/projects/json' } ); 
    // });

    // app.get('/user/projects/json', loginRequired, function (req, res, next) {
    //     var idx = req.query.idx;
    //     var len = req.query.len;
    //     interface.getUserProjects(req.user, idx, len)
    //         .then(
    //             function(results){
    //                 var userId = req.user;
    //                 results.forEach(function(item){
    //                     if(item.user_id == userId) item.appendUrl = "/project/" + item.id + "/precommit";
    //                 });
    //                 res.status(200).json({ items: results });
    //             },
    //             function(err){ res.status(500).json({error: "Internal server error: " + err}); }
    //         );
    // });

};
