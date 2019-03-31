require('dotenv').config();
var mongoose = require('mongoose');
var Quote = require('../models/quote');


module.exports = function (context, req) {
    context.log('Get Random Quote Called');

     // Proceed to parse and save the message
     var connString = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" +  process.env.DB_HOST + "/" + process.env.DB_NAME + "?retryWrites=true";

     mongoose.connect(connString, {useNewUrlParser: true});

     var db = mongoose.connection;
     db.on('error', console.error.bind(console, 'connection error:'));

     db.on('open', function(err){
        console.log('Connected to Mongo DB');

        // We use the aggregate function on mongodb
        Quote.aggregate().sample(1).exec(function(err, result){
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

   
};