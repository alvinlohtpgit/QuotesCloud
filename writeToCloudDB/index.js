require('dotenv').config();
var mongoose = require('mongoose');
var async = require('async');
var Quote = require('../models/quote');
var Tag = require('../models/tag');

module.exports = function (context, req) {
    
    var connString = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" +  process.env.DB_HOST + "/" + process.env.DB_NAME + "?retryWrites=true";

    mongoose.connect(connString, {useNewUrlParser: true});

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
                    mongoose.connection.close();

                    context.res = {
                        status: 200,
                        headers: {
                              'Content-Type': 'text/html'
                            },
                        body: "Quote Saved with ID " + result.id
                      };
                      context.done();

                  
                });

            });

        }

    });



    //context.log('JavaScript HTTP trigger function processed a request.');

    //if (req.query.name || (req.body && req.body.name)) {
    //    context.res = {
            // status: 200, /* Defaults to 200 */
    //        body: "Hello " + (req.query.name || req.body.name)
    //    };
    //}
    //else {
    //    context.res = {
    //        status: 400,
     //       body: "Please pass a name on the query string or in the request body"
     //   };
    //} 


};