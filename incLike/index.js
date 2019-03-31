var mongoose = require('mongoose');
var Quote = require('../models/quote');

module.exports =  function (context, req) {
        
    context.log('Increment function called');

    // Proceed to parse and save the message
    var connString = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" +  process.env.DB_HOST + "/" + process.env.DB_NAME + "?retryWrites=true";

    mongoose.connect(connString, {useNewUrlParser: true});

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    db.on('open', function(err){
        console.log('Connected to Mongo DB');


        var quoteID = req.query.qid;

        Quote.findOneAndUpdate( {_id : quoteID} , { $inc: {numoflikes: 1} } , {new: true} , function(err, result){

            if (err){
                context.log("Err : " + err);
            }

            context.log('Done update');

            mongoose.connection.close();
            
            context.res = {
                status: 200,
                body: "OK"
            }
            context.done();
        });

    }); // CLose db.on open

    

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