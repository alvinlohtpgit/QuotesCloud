var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuoteSchema = new Schema({
    message: {type:String , required: true},
    tags: [{type:String}],
    submitter: {type:String, required: true}
});

module.exports = mongoose.model('Quote' , QuoteSchema);