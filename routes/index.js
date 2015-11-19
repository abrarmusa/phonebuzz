var express = require('express');
var config = require('../config.js');
var router = express();
var twilio = require('twilio');
var fizzbuzzcalculator = require('../public/javascripts/fizzbuzz.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Endpoint for Twilio call
router.post('/phonebuzzer', function(req, res) {
  var url = 'http://' + req.headers.host + '/fizzbuzz';
  if (twilio.validateExpressRequest(req, config.authToken)) {
    var resp = new twilio.TwimlResponse();
    resp.say('Welcome to Phonebuzz').gather({
      action: url,
      finishOnKey: '#'
    }, function() {
      this.say('Please enter a number greater than 0 to run fizzbuz. Press pound after you have finished entering the number.')
    });
    res.type('text/xml');
    res.send(resp.toString());
  } else {
    res.status(403).send('This is not a twilio request! Only requests from twilio are accepted');
  }
});

// Endpoint for fizzbuzz output through Twilio
router.post('/fizzbuzz', function(req, res) {
  var number = 0;
  var digits = req.body.Digits;
  if ( digits && (number = parseInt(digits) > 0) ){
    var fizzBuzzer = new twilio.TwimlResponse();
    var result = fizzbuzzcalculator(number);
    fizzBuzzer.say("Fizzbuzz has been calculated.").pause({ length: 2 }).say(result);
    fizzBuzzer.say("Thank you for using fizzbuzzer");
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(fizzBuzzer.toString());
  } else {
    fizzBuzzer.say("You have made an invalid entry");
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(fizzBuzzer.toString());
  }
});

module.exports = router;
