module.exports = (function() {
    var twit = require('twit'),
        _ = require('lodash'),
        async = require('async');

    // test keys
    var t = new twit({
        consumer_key: 'B5fNzJn2sK86UzyQ5OB5ZkKNv',
        consumer_secret: 'zRnBSKW3OEhMvn7raqcCwvXXEiiXkGF7GcopSJX586Q3WI8kJF',
        access_token: '24444344-sjlfdsK5rf1fsVTM0Qg9DeHE8Zl7zeZhrr1KcCwnD',
        access_token_secret: 'pZI4kSyL5EsbfdvHYeF9Zwsy2T6TxcgIYAHzPiFMidwLv'
    });

    return {
        trends: trends
    };

    function trends(done) {
        t.get('trends/place', {id: 1}, function(err, data) {
            if (err) return done(err);
            done(null, data[0].trends);
        });
    }
}());
