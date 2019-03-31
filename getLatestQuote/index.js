require('dotenv').config();
var mongoose = require('mongoose');
var Quote = require('../models/quote');


module.exports = function (context, req) {
    context.log('Get Latest Quote Called');

     // Proceed to parse and save the message
     var connString = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" +  process.env.DB_HOST + "/" + process.env.DB_NAME + "?retryWrites=true";

     mongoose.connect(connString, {useNewUrlParser: true});

     var db = mongoose.connection;
     db.on('error', console.error.bind(console, 'connection error:'));

     db.on('open', function(err){
        console.log('Connected to Mongo DB');

        Quote.findOne({}).sort({createdon: -1}).exec(function(err , result){
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: result
            }

            context.done();
        });

     });

    
    // if (req.query.name || (req.body && req.body.name)) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }
};