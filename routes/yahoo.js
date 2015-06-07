module.exports = (function() {
    var _ = require('lodash'),
        async = require('async')
        request = require('request')
        parseString = require('xml2js').parseString;

    // consumer key not app id cuz fuck yahooapis
    // test key
    var yid = 'dj0yJmk9UWhwaDVhU3NQOVU2JmQ9WVdrOWEwVmliWEZXTkdjbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04OA--';

    return {
        location: location
    };

    function location(input, done) {
        console.log(input.locations);
        var loc = input.locations[0].woeid;
        var query = 'http://where.yahooapis.com/v1/place/' + loc + '?appid=' + yid;
        request.get(query, function(err, res, body) {
            if (err) return done(err);
            parseString(body, function(err, result) {
                if (err) return done(err);
                done(null, result.place.centroid[0]);
            });
        });
    }
}());
