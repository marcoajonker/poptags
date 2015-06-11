var express = require('express'),
    twitter = require('./twitter'),
    yahoo = require('./yahoo'),
    instagram = require('./instagram');
var router = express.Router();

var world_trends, ig_pics;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(ig_pics);
});

twitter.trends(function(err, trends) {
    if (err) console.error(err);
    world_trends = trends;
    instagram.pictures(world_trends, function(err, pictures) {
        if (err) console.error(err);
        ig_pics = pictures;
        // console.log(ig_pics);
    });
    setInterval(function() {
        instagram.pictures(trends, function(err, pictures) {
            if (err) console.error(err);
            ig_pics = pictures;
            // console.log(ig_pics);
        });
    }, 90000);
    setInterval(function() {
        twitter.trends(function(err, trends) {
            if (err) console.error(err);
            world_trends = trends;
            // console.log(world_trends);
        });
    }, 100000);
});



module.exports = router;
