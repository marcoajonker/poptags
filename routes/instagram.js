module.exports = (function() {

    var ig = require('instagram-node').instagram(),
        async = require('async'),
        _ = require('lodash');

    // test keys
    ig.use({
        client_id: 'fa89623ea3624d8ca4ea0359d53dfd98',
        client_secret: '0734395ea54e494a91d255e2e6ffe69a'
    });

    return {
        pictures: pictures
    };
    // {min_timestamp: Date.now() - 172800000 },
    function pictures(trends, done) {
        var trend_pics;
        async.waterfall([
            function(done) {
                async.map(trends, function(trend, next) {
                    var q = trend.name.charAt(0) == '#' ? trend.name.slice(1) : trend.name;
                    ig.tag_search(q.replace(/ /g, ''), function(err, result, remaining, limit) {
                        if (err) next(err);
                        next(null, result[0]);
                    });
                }, function(err, results) {
                    if (err) return console.error(err);
                    done(null, _.compact(results));
                });
            },
            function(trends, done) {
                async.map(trends, function(trend, next) {
                    var max_page;
                    var init = {
                        count: 33
                    };
                    var post_init = {
                        count: 33,
                        max_tag_id: max_page
                    };
                    // (n === 0 ? init : post_init)
                    async.timesSeries(5, function(n, inner_next) {
                        if (n === 0) {
                            ig.tag_media_recent(trend.name, {count: 33}, function(err, medias, pagination, remaining, limit) {
                                if (err) inner_next(err);
                                //TODO get last 1000. order by likes.
                                // getting the 5 iterations of the same items.
                                // cant displace by next_max_id like expected
                                max_page = pagination.next_max_id;
                                console.log(trend.name, max_page);
                                inner_next(null, medias);
                            });
                        } else {
                            ig.tag_media_recent(trend.name, {count: 33, max_tag_id: max_page}, function(err, medias, pagination, remaining, limit) {
                                if (err) inner_next(err);
                                //TODO get last 1000. order by likes.
                                // getting the 5 iterations of the same items.
                                // cant displace by next_max_id like expected
                                max_page = pagination.next_max_id;
                                console.log(trend.name, max_page);
                                inner_next(null, medias);
                            });
                        }
                    }, function(err, results) {
                        if (err) return next(err);
                        next(null, {
                            trend: trend.name,
                            pictures: _.chain(results)
                                .flatten()
                                .uniq()
                                .value()
                        });
                    });

                }, function(err, results) {
                    if (err) return console.error(err);
                    done(null, _.filter(results, function(item) {
                        return item.pictures.length !== 0;
                    }));
                });
            }
        ], function(err, results) {
            if (err) return done(err);
            done(null, results);
        });


    }

}());
