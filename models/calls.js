var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var callSchema = new Schema({
  phonenumber: String,
  digits: String,
  delay: Number,
  calltime: Number
});

// Create a Call model for callSchema
var Calls = mongoose.model('Calls', callSchema);
// make this available to our users in our Node applications
module.exports = Calls;