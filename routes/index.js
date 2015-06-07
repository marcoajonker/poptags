var express = require('express'),
    twitter = require('./twitter'),
    yahoo = require('./yahoo'),
    instagram = require('./instagram');
var router = express.Router();

var world_trends;
/* GET home page. */
router.get('/', function(req, res, next) {
    twitter.trends(function(err, trends) {
        if (err) console.error(err);
        world_trends = trends;
        console.log(trends);
            instagram.pictures(trends, function(err, pictures) {
                if (err) console.error(err);
                res.send(pictures);
            });
    });
});

module.exports = router;
