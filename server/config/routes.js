/**
 * Routes for express app
 */
var express = require('express');

var path = require('path');

var constants = require('./const');

module.exports = function(app) {

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

};
