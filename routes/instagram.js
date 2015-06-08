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
                    var max_page, params;
                    async.timesSeries(5, function(n, inner_next) {
                        params = {
                            count: 33,
                            max_tag_id: max_page
                        };
                        if (n === 0) params = { count: 33 };
                        ig.tag_media_recent(trend.name, params, function(err, medias, pagination, remaining, limit) {
                            if (err) inner_next(err);
                            //TODO get last 1000. order by likes.
                            max_page = pagination.next_max_id;
                            inner_next(null, medias);
                        });
                    }, function(err, results) {
                        if (err) return next(err);
                        next(null, {
                            trend: trend.name,
                            pictures: _.chain(results)
                                .flatten()
                                .uniq('link')
                                .sortBy(function(item) {
                                    return -(item.likes.count);
                                })
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
