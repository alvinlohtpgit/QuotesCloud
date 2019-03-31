var mongoose = require('mongoose');
var timeZone = require('mongoose-timezone');
var Schema = mongoose.Schema;

var QuoteSchema = new Schema({
    message: {type:String , required: true},
    author: {type:String, required: true},
    createdon: {type:Date},
    tags: [{type:String}],
    numoflikes: {type:Number, required:true},
    submitter: {type:String, required: true}
});

QuoteSchema.plugin(timeZone);

module.exports = mongoose.model('Quote' , QuoteSchema);