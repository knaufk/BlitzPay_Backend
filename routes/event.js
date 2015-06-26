var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var DATABASE_URL = "mongodb://localhost:27017/test";
var EVENT_COLLECTION = 'event';

function makeId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createAndPersistEvent(req) {
    var event = req.body;
    var id = makeId();
    event.eventCode = id;
    event._id = id;
    MongoClient.connect(DATABASE_URL, function (err, db) {
        console.log("Successfully connected to our awesome database, yeah!");
        var collection = db.collection(EVENT_COLLECTION);
        var item = null;
        do {
            collection.findOne({"_id": req.params.id}, function (err, existingItem) {
                if (existingItem) {
                    item = existingItem;
                    id = makeId();
                    event.eventCode = id;
                    event._id = eventCode;
                }
            });
        } while (item);
        collection.insertOne(event);
    });
    return event;
}

router.post('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var event = createAndPersistEvent(req);
    res.status(201).json(event);
});

router.get('/:id', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    MongoClient.connect(DATABASE_URL,function(err, db) {
        if (err) {
            console.log("Start your database!");
            return;
        }
        console.log("Successfully connected to our awesome database, yeah!");
        var collection = db.collection(EVENT_COLLECTION);
        collection.findOne({"_id" : req.params.id}, function(err, item){
            if(err || !item) {
                console.log("Could not retrieve event with id " + req.params.id);
                res.send(404);
                return;
            }
            delete item._id;
            res.json(item);
        });
    });
});



module.exports = router;
