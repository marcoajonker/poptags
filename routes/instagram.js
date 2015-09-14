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
        async.map(trends, function(trend, next) {
            async.waterfall([
                function(done) {
                    // for each twitter trend get the most popular related instagram #
                    // prep trends for instagram search

                    var q = trend.name.charAt(0) === '#' ? trend.name.slice(1) : trend.name;
                    ig.tag_search(q.replace(/ /g, ''), function(err, result) {
                        if (err) return done(err);

                        if (result.length === 0) {
                            return done(null, null)
                        }
                        done(null, result[0]);
                    });
                },
                function(ig_trend, done) {
                    if (!ig_trend) {
                        return done(null, {
                            trend: trend.name,
                            pictures: [],
                            url: trend.url,
                            promoted: trend.promoted_content
                        });
                    }
                    var max_page;
                    async.timesSeries(50, function(n, inner_next) {
                        var params = {
                            count: 33,
                            max_tag_id: max_page
                        };
                        if (n === 0) params = {
                            count: 33
                        }; // first req doesn't use pages
                        ig.tag_media_recent(ig_trend.name, params, function(err, medias, pagination) {
                            if (err) return inner_next(err);
                            max_page = pagination.next_max_id;
                            inner_next(null, medias);
                        });
                    }, function(err, results) {
                        if (err) return done(err);
                        var pics = _.chain(results)
                            .flatten()
                            .uniq(false, 'link')
                            // get top 100 liked item from last 50 reqs
                            .sortBy(function(item) {
                                return -(item.likes.count);
                            })
                            .take(100)
                            .groupBy(function(pic) {
                                var likes = pic.likes.count
                                if (likes >= 10000) {
                                    return '10k'
                                } else if (likes >= 1000) {
                                    return '1k'
                                } else {
                                    return '0k'
                                }
                            })
                            .defaults({'10k': [],
                                        '1k': [],
                                        '0k': []
                            })
                            .value()

                        done(null, {
                            trend: trend.name,
                            pictures: pics,
                            url: trend.url,
                            promoted: trend.promoted_content
                        });
                    });
                }],
            function(err, results) {
                if (err) return next(err);
                next(null, results);
            });
        }, function(err, results) {
            console.log('finished')
            if (err) return done(err)
            done(null, results)
        });
    }
}());
