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
        async.waterfall([
            function(done) {
                // for each twitter trend get the most popular related instagram #
                async.map(trends, function(trend, next) {
                    // prep trends for instagram search
                    var q = trend.name.charAt(0) === '#' ? trend.name.slice(1) : trend.name;
                    ig.tag_search(q.replace(/ /g, ''), function(err, result) {
                        if (err) return next(err);
                        next(null, result[0]);
                    });
                }, function(err, results) {
                    if (err) return done(err);
                    done(null, _.compact(results)); // remove null content
                });
            },
            function(ig_tags, done) {
                async.map(ig_tags, function(trend, next) {
                    var max_page;
                    async.timesSeries(50, function(n, inner_next) {
                        var params = {
                            count: 33,
                            max_tag_id: max_page
                        };
                        if (n === 0) params = { count: 33 }; // first req doesn't use pages
                        ig.tag_media_recent(trend.name, params, function(err, medias, pagination) {
                            if (err) return inner_next(err);
                            max_page = pagination.next_max_id;
                            inner_next(null, medias);
                        });
                    }, function(err, results) {
                        if (err) return next(err);
                        next(null, {
                            trend: trend.name,
                            pictures: _.chain(results)
                                .flatten()
                                .uniq(false, 'link')
                                // get top 100 liked item from last 50 reqs
                                .sortBy(function(item) {
                                    return -(item.likes.count);
                                })
                                .take(100)
                                .value()
                        });
                    });

                }, function(err, results) {
                    if (err) done(err);
                    done(null, _.filter(results, function(item) {
                        return item.pictures.length;
                    }));
                });
            }
        ], done);


    }

}());
