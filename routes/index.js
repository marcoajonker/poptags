var express = require('express'),
    async = require('async'),
    twitter = require('./twitter'),
    instagram = require('./instagram'),
    swig = require('swig');
var router = express.Router();

var ig_pics;
var template = swig.compileFile('./views/index.html');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(template({pics: ig_pics}));
});

var INTERVAL = 100000;

async.forever(function(next) {
    // We want calling this function again to be independent of the results, so this is outside of the waterfall
    setTimeout(next, INTERVAL);
    async.waterfall([twitter.trends, instagram.pictures], function(err, pictures) {
        if (err) return console.error(err);
        ig_pics = pictures;
    });
});




module.exports = router;
