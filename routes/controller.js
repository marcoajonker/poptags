var express = require('express'),
    async = require('async'),
    twitter = require('./twitter'),
    instagram = require('./instagram'),
    swig = require('swig'),
    fs = require('fs');
var router = express.Router();

var ig_pics;
var template = swig.compileFile('./views/index.html');

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.send(template({pics: ig_pics}));
    res.send({pics: ig_pics});
});

var INTERVAL = 1000000;

async.forever(function(next) {
    // We want calling this function again to be independent of the results, so this is outside of the waterfall
    setTimeout(next, INTERVAL);
    async.waterfall([twitter.trends, instagram.pictures], function(err, pictures) {
        if (err) return console.error(err);
        ig_pics = pictures;
    });
});

module.exports = router;

// ig_pics = [{
// "trend": "historicalrealityshows",
// "pictures": [
// {
// "attribution": null,
// "tags": [
// "hashtagwarart",
// "historicalrealityshows"
// ],
// "location": {
// "latitude": 34.101279295,
// "longitude": -118.247361749
// },
// "comments": {
// "count": 3,
// "data": [
// {
// "created_time": "1437450690",
// "text": "@taryntheduck",
// "from": {
// "username": "buscemi.or.die",
// "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/s150x150/11356798_1039562136076279_1058043943_a.jpg",
// "id": "1459993124",
// "full_name": "Trash Queen"
// },
// "id": "1033733772114635350"
// },
// {
// "created_time": "1437456297",
// "text": "Real Housewives of Henry the VIII",
// "from": {
// "username": "young_grasswhopper",
// "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11378774_779229702196085_2079823498_a.jpg",
// "id": "587112300",
// "full_name": "Chase Cassidy"
// },
// "id": "1033780807333292047"
// },
// {
// "created_time": "1437457703",
// "text": "Keeping up with the Medici's",
// "from": {
// "username": "herbert_bros",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_1071275417_75sq_1391738907.jpg",
// "id": "1071275417",
// "full_name": ""
// },
// "id": "1033792607160347287"
// }
// ]
// },
// "filter": "Normal",
// "created_time": "1437450600",
// "link": "https://instagram.com/p/5YjrTDt6qZ/",
// "likes": {
// "count": 648,
// "data": [
// {
// "username": "_michael_joe_",
// "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11245910_391178287753031_1064273151_a.jpg",
// "id": "2092493953",
// "full_name": "Michael"
// },
// {
// "username": "zoe_marceaux",
// "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xft1/t51.2885-19/10424626_1615398502072679_363129060_a.jpg",
// "id": "2064107379",
// "full_name": "Zⓞⓔ Mⓐⓓⓘⓢⓞⓝ Mⓐⓡⓒⓔⓐⓤⓧ"
// },
// {
// "username": "the_jewish_lion",
// "profile_picture": "https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xat1/t51.2885-19/11191578_823136141103300_289492079_a.jpg",
// "id": "2078031479",
// "full_name": "Julian Giron"
// },
// {
// "username": "zaceratops",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11258088_488625031303609_355232853_a.jpg",
// "id": "2098086639",
// "full_name": "Zac C."
// }
// ]
// },
// "images": {
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s320x320/e15/11337155_856627057762619_474235405_n.jpg",
// "width": 320,
// "height": 320
// },
// "thumbnail": {
// "url": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s150x150/e15/11337155_856627057762619_474235405_n.jpg",
// "width": 150,
// "height": 150
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/s640x640/e35/sh0.08/11337155_856627057762619_474235405_n.jpg",
// "width": 640,
// "height": 640
// }
// },
// "users_in_photo": [],
// "caption": {
// "created_time": "1437450600",
// "text": "Tonight's #hashtagwarart is sponsored by Extreme Takeover Rome Edition. #HistoricalRealityShows",
// "from": {
// "username": "atmidnightcc",
// "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11372390_856059004468165_962410838_a.jpg",
// "id": "599713561",
// "full_name": "@Midnight"
// },
// "id": "1033733024547056144"
// },
// "type": "image",
// "id": "1033733021510380185_599713561",
// "user": {
// "username": "atmidnightcc",
// "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11372390_856059004468165_962410838_a.jpg",
// "id": "599713561",
// "full_name": "@Midnight"
// }
// },
// {
// "attribution": null,
// "videos": {
// "low_bandwidth": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11769487_416352081896211_859817607_s.mp4",
// "width": 480,
// "height": 480
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11779366_1433957103600184_1023699665_n.mp4",
// "width": 640,
// "height": 640
// },
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11769487_416352081896211_859817607_s.mp4",
// "width": 480,
// "height": 480
// }
// },
// "tags": [
// "historicalrealityshows"
// ],
// "location": {
// "latitude": 34.101304882,
// "longitude": -118.247166155
// },
// "comments": {
// "count": 27,
// "data": [
// {
// "created_time": "1437453583",
// "text": "#HistoricRealityShows @atmidnightcc The Big Bang Theory (Live from Space)",
// "from": {
// "username": "adrian.mun16",
// "profile_picture": "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11330711_1460282167604072_1010865299_a.jpg",
// "id": "407119938",
// "full_name": "Adrian Munoz (A🌲N 🌙EO's)"
// },
// "id": "1033758040391133743"
// },
// {
// "created_time": "1437453995",
// "text": "#HistoricRealityShows @atmidnightcc  MTV The Real World Pompeii",
// "from": {
// "username": "kristenlboone",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_43202401_75sq_1392775092.jpg",
// "id": "43202401",
// "full_name": "Kristen Boone"
// },
// "id": "1033761499576249135"
// },
// {
// "created_time": "1437454204",
// "text": "So you think you can lance. #historicrealityshows",
// "from": {
// "username": "stonewall_smashton",
// "profile_picture": "https://igcdn-photos-d-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/s150x150/11417248_1638788786396587_199098763_a.jpg",
// "id": "319343421",
// "full_name": ""
// },
// "id": "1033763251654470555"
// },
// {
// "created_time": "1437454231",
// "text": "Dancing with the bars and stars. #historicrealityshows",
// "from": {
// "username": "stonewall_smashton",
// "profile_picture": "https://igcdn-photos-d-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/s150x150/11417248_1638788786396587_199098763_a.jpg",
// "id": "319343421",
// "full_name": ""
// },
// "id": "1033763475202485164"
// },
// {
// "created_time": "1437454383",
// "text": "Everyone, discus 🎉💥🎊",
// "from": {
// "username": "gamora3001",
// "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10520344_823664294358646_416305314_a.jpg",
// "id": "1592299967",
// "full_name": "ml"
// },
// "id": "1033764756713352191"
// },
// {
// "created_time": "1437454443",
// "text": "Toga timeline",
// "from": {
// "username": "gamora3001",
// "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10520344_823664294358646_416305314_a.jpg",
// "id": "1592299967",
// "full_name": "ml"
// },
// "id": "1033765257613912097"
// },
// {
// "created_time": "1437454885",
// "text": "Public service announcement: Senate will not be open to tourists on March 15, 44 BC",
// "from": {
// "username": "gamora3001",
// "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10520344_823664294358646_416305314_a.jpg",
// "id": "1592299967",
// "full_name": "ml"
// },
// "id": "1033768960882354440"
// },
// {
// "created_time": "1437455123",
// "text": "The Colosseum support staff strongly advises anyone being dragged to the petting zoo wear armor and carry a sharp object.",
// "from": {
// "username": "gamora3001",
// "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10520344_823664294358646_416305314_a.jpg",
// "id": "1592299967",
// "full_name": "ml"
// },
// "id": "1033770961657637267"
// }
// ]
// },
// "filter": "Normal",
// "created_time": "1437449356",
// "link": "https://instagram.com/p/5YhTcON6mT/",
// "likes": {
// "count": 486,
// "data": [
// {
// "username": "freebaldjeff",
// "profile_picture": "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/11184484_903281559718816_1647741134_a.jpg",
// "id": "1993620960",
// "full_name": "FreeBald"
// },
// {
// "username": "douglasreimer",
// "profile_picture": "https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11312490_460208814155991_516725788_a.jpg",
// "id": "2026506793",
// "full_name": "Douglas Reimer"
// },
// {
// "username": "seanallphin",
// "profile_picture": "https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11264209_1598245060441910_1551385176_a.jpg",
// "id": "2055269794",
// "full_name": "Sean Allphin"
// },
// {
// "username": "charmanderman12",
// "profile_picture": "https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11296896_1447845628863272_1249659051_a.jpg",
// "id": "2036833783",
// "full_name": "Nestor"
// }
// ]
// },
// "images": {
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11416837_512055412284292_829998681_n.jpg",
// "width": 320,
// "height": 320
// },
// "thumbnail": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11416837_512055412284292_829998681_n.jpg",
// "width": 150,
// "height": 150
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11416837_512055412284292_829998681_n.jpg",
// "width": 640,
// "height": 640
// }
// },
// "users_in_photo": [],
// "caption": {
// "created_time": "1437449356",
// "text": "In honor of our Another Period panel, tonight's hashtag war is #HistoricalRealityShows. Check out these examples and play along!",
// "from": {
// "username": "atmidnightcc",
// "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11372390_856059004468165_962410838_a.jpg",
// "id": "599713561",
// "full_name": "@Midnight"
// },
// "id": "1033727093499209731"
// },
// "type": "video",
// "id": "1033722585989753235_599713561",
// "user": {
// "username": "atmidnightcc",
// "profile_picture": "https://igcdn-photos-f-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/11372390_856059004468165_962410838_a.jpg",
// "id": "599713561",
// "full_name": "@Midnight"
// }
// },
// {
// "attribution": null,
// "videos": {
// "low_bandwidth": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11726584_1630002530616535_649861422_s.mp4",
// "width": 480,
// "height": 480
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11769571_727526670702918_2122438598_n.mp4",
// "width": 640,
// "height": 640
// },
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t50.2886-16/11726584_1630002530616535_649861422_s.mp4",
// "width": 480,
// "height": 480
// }
// },
// "tags": [
// "historicalrealityshows",
// "السعودية",
// "ي",
// "مريم",
// "دعوت",
// "historicrealityshows",
// "divarevoution",
// "ابو",
// "تتلى",
// "dubai",
// "ربهم",
// "لهجه",
// "تأديته",
// "raw",
// "raiseit",
// "هضما",
// "growingupwithglasses",
// "عملاءstc",
// "wweraw",
// "scnumber1",
// "الإمارات",
// "لازب",
// "قانون",
// "gendercard",
// "العجلة",
// "شهيد",
// "كفروا",
// "rkos"
// ],
// "location": null,
// "comments": {
// "count": 0,
// "data": []
// },
// "filter": "Normal",
// "created_time": "1437459321",
// "link": "https://instagram.com/p/5Y0T2juPOT/",
// "likes": {
// "count": 6,
// "data": [
// {
// "username": "sir_komishk",
// "profile_picture": "https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/914508_601294690006620_1189007915_a.jpg",
// "id": "36955784",
// "full_name": "Ibrahim Ahmed"
// },
// {
// "username": "shail_alyamane",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xta1/t51.2885-19/10666144_282749415247209_25025162_a.jpg",
// "id": "1326516425",
// "full_name": "سْـهيل ،،،"
// },
// {
// "username": "mustykk1",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/s150x150/11255059_969349903107889_1695535079_a.jpg",
// "id": "174776131",
// "full_name": "mustapha krisht"
// },
// {
// "username": "_t7_",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10474919_315233938632737_53509_a.jpg",
// "id": "1180873643",
// "full_name": "المقرود"
// }
// ]
// },
// "images": {
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11282193_1499799060311251_604286351_n.jpg",
// "width": 320,
// "height": 320
// },
// "thumbnail": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11282193_1499799060311251_604286351_n.jpg",
// "width": 150,
// "height": 150
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11282193_1499799060311251_604286351_n.jpg",
// "width": 640,
// "height": 640
// }
// },
// "users_in_photo": [],
// "caption": {
// "created_time": "1437459321",
// "text": "#dubai #الإمارات #قانون #ربهم #تتلى #لازب #تأديته #كفروا #هضما #شهيد #لهجه #عملاءstc #كفروا #ابو #السعودية #العجلة، #مريم #يَعْجَلْ، #يُستجبْ #دعوتُ، #wweraw #historicalrealityshows #raiseit #historicrealityshows #rkos #scnumber1 #divarevoution #raw #growingupwithglasses #gendercard",
// "from": {
// "username": "_t7_",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10474919_315233938632737_53509_a.jpg",
// "id": "1180873643",
// "full_name": "المقرود"
// },
// "id": "1033807631752950592"
// },
// "type": "video",
// "id": "1033806177151546259_1180873643",
// "user": {
// "username": "_t7_",
// "profile_picture": "https://igcdn-photos-b-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/10474919_315233938632737_53509_a.jpg",
// "id": "1180873643",
// "full_name": "المقرود"
// }
// },
// {
// "attribution": null,
// "tags": [
// "historicalrealityshows",
// "privatetwitter",
// "publicinsta"
// ],
// "location": null,
// "comments": {
// "count": 0,
// "data": []
// },
// "filter": "Normal",
// "created_time": "1437455254",
// "link": "https://instagram.com/p/5YsjVKikqr/",
// "likes": {
// "count": 0,
// "data": []
// },
// "images": {
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11313225_751894098253088_804855574_n.jpg",
// "width": 320,
// "height": 320
// },
// "thumbnail": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11313225_751894098253088_804855574_n.jpg",
// "width": 150,
// "height": 150
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11313225_751894098253088_804855574_n.jpg",
// "width": 640,
// "height": 640
// }
// },
// "users_in_photo": [],
// "caption": {
// "created_time": "1437455254",
// "text": "Even more #historicalrealityshows @nerdist @midnight #publicinsta #privatetwitter",
// "from": {
// "username": "sara4189",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_208960657_75sq_1355678571.jpg",
// "id": "208960657",
// "full_name": "Sara B"
// },
// "id": "1033772059773783034"
// },
// "type": "image",
// "id": "1033772056435116715_208960657",
// "user": {
// "username": "sara4189",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_208960657_75sq_1355678571.jpg",
// "id": "208960657",
// "full_name": "Sara B"
// }
// },
// {
// "attribution": null,
// "tags": [
// "historicalrealityshows",
// "privatetwitter",
// "publicinsta"
// ],
// "location": null,
// "comments": {
// "count": 0,
// "data": []
// },
// "filter": "Normal",
// "created_time": "1437454106",
// "link": "https://instagram.com/p/5YqXQ9Ckno/",
// "likes": {
// "count": 0,
// "data": []
// },
// "images": {
// "low_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e15/11429743_452430864960336_239070116_n.jpg",
// "width": 320,
// "height": 320
// },
// "thumbnail": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e15/11429743_452430864960336_239070116_n.jpg",
// "width": 150,
// "height": 150
// },
// "standard_resolution": {
// "url": "https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11429743_452430864960336_239070116_n.jpg",
// "width": 640,
// "height": 640
// }
// },
// "users_in_photo": [],
// "caption": {
// "created_time": "1437454106",
// "text": "@midnight @nerdist #historicalrealityshows #privatetwitter #publicinsta",
// "from": {
// "username": "sara4189",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_208960657_75sq_1355678571.jpg",
// "id": "208960657",
// "full_name": "Sara B"
// },
// "id": "1033762434382973384"
// },
// "type": "image",
// "id": "1033762431186913768_208960657",
// "user": {
// "username": "sara4189",
// "profile_picture": "https://instagramimages-a.akamaihd.net/profiles/profile_208960657_75sq_1355678571.jpg",
// "id": "208960657",
// "full_name": "Sara B"
// }
// }
// ]
// }
// ]
