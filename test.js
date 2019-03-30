require('dotenv').config();
var mongoose = require('mongoose');
var async = require('async');
var Quote = require('./models/quote')
var Tag = require('./models/tag');

mongoose.connect('mongodb+srv://alvinloh:M8S24Vds@cluster0-p9v8t.mongodb.net/QuotesDB?retryWrites=true', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.on('open', function(err){
    console.log('Connected to Mongo DB');


    var newQuote = new Quote({
        message: 'Test Message',
        tags: ['tag1', 'tag2'],
        submitter: 'Alvin'
    });
    

    // If there are tags, insert the tags first
    if (newQuote.tags.length > 0){

        // Loop through the newQuote
        var tagsArray = newQuote.tags;

        async.forEachOf(tagsArray , function( value , key , callback){
            var newTag = new Tag({
                name: value
            });
            newTag.save(function(err, result){
                console.log("Saved Tag : " + result.id);
                callback();
            });
        },function(err){
            if (err) {console.log("Error writing tags : " + err);}

            // We are done inserting tags,  let's insert the main quote
            newQuote.save(function(err , result){
                console.log("Message saved : " + result.id);
           });

        });

    }

});