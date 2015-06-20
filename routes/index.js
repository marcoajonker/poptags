var express = require('express'),
    async = require('async'),
    twitter = require('./twitter'),
    instagram = require('./instagram');
var router = express.Router();

var world_trends, ig_pics;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send(ig_pics);
});

var INTERVAL = 100000;

/* A few alternate solutions: */

/*
 * (1) Using an Interval
 */
/*
function feed_twitter_into_instagram_in_interval() {
    async.waterfall([twitter.trends, instagram.pictures], function(err, pictures) {
        if (err) return console.error(err);
        ig_pics = pictures;
    });
}
setInterval(feed_twitter_into_instagram_in_interval, INTERVAL); // Need to set the interval
feed_twitter_into_instagram_in_interval();                      // Also, need to call it so it happens now
*/

/*
 * (2) Using a timeout and some recursion
 */
/*
function feed_twitter_into_instagram_and_set_timeout() {
    // We want calling this function again to be independent of the results, so this is outside of the waterfall
    setTimeout(feed_twitter_into_instagram_and_set_timeout, INTERVAL);
    async.waterfall([twitter.trends, instagram.pictures], function(err, pictures) {
        if (err) return console.error(err);
        ig_pics = pictures;
    });
}
feed_twitter_into_instagram_and_set_timeout(); // Just need to kick it off. It will deal with calling again
*/

/*
 * (3) Using async.forever and a timeout
 */
/*
async.forever(function(next) {
    // We want calling this function again to be independent of the results, so this is outside of the waterfall
    setTimeout(next, INTERVAL);
    async.waterfall([twitter.trends, instagram.pictures], function(err, pictures) {
        if (err) return console.error(err);
        ig_pics = pictures;
    });
});
*/

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
