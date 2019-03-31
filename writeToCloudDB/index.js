require('dotenv').config();
var mongoose = require('mongoose');
var async = require('async');
var Quote = require('../models/quote');
var Tag = require('../models/tag');

module.exports = function (context, req) {
    
    
    context.log('JavaScript HTTP trigger function processed a request.');

    var payLoad = {};

    if (req.body){
        payLoad = req.body;

        // Check at least the message is available
        if ((!payLoad.message) || (payLoad.message == '')){
            context.res = {
                status: 400,
                body: "Please enter the message for the quote"
            }
            context.done();
        }


        // Proceed to parse and save the message
        var connString = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" +  process.env.DB_HOST + "/" + process.env.DB_NAME + "?retryWrites=true";

        mongoose.connect(connString, {useNewUrlParser: true});

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        db.on('open', function(err){
            console.log('Connected to Mongo DB');


            var newQuote = new Quote({
                message: payLoad.message,
                author: payLoad.author ? payLoad.author : 'Anonymous',
                createdon: Date.now(),
                tags: payLoad.tags,
                numoflikes: 0,
                submitter: payLoad.submitter ? payLoad.submitter : 'Anonymous'
            });
            

            // If there are tags, insert the tags first
            if (newQuote.tags.length > 0){

                // Loop through the newQuote
                var tagsArray = newQuote.tags;

                async.forEachOf(tagsArray , function( value , key , callback){
                    var newTag = new Tag({
                        name: value
                    });

                    Tag.findOneAndUpdate(
                        {name: value},
                        newTag,
                        {upsert: true, new: true, runValidators: true},
                        function(err, result){
                            console.log("Processed Tag : " + value);
                            callback();
                        }
                    );

                },function(err){
                    if (err) {console.log("Error writing tags : " + err);}

                    // We are done inserting tags,  let's insert the main quote
                    newQuote.save(function(err , result){
                        console.log("Message saved : " + result.id);
                        mongoose.connection.close();

                        context.res = {
                            status: 200,
                            body: "Quote Saved with ID " + result.id
                        };
                        context.done();

                    });
                });
            }
        });

    } // Close if req.body == true

    else{
        // Just return a 404
        context.res = {
            status: 400, /* Defaults to 200 */
            body: "Please input a valid Quote payload"
        };
        context.done();
    }




};