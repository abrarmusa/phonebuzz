var express = require('express');
var config = require('../config.js');
var router = express();
var twilio = require('twilio');
var fizzbuzzcalculator = require('../public/javascripts/fizzbuzz.js');

/* GET home page. */
router.get('/', function(req, res){
    res.render('index', {title: 'PhoneBuzz'});
})

// Endpoint for Twilio call
router.post('/phonebuzzer', function(req, res) {
  var url = 'http://' + req.headers.host + '/fizzbuzz';
  // Validate twilio request
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
  var digits = req.body.Digits;
  if ( req.body.Digits ){
    var number = parseInt(req.body.Digits);
    var fizzBuzzer = new twilio.TwimlResponse();
    // If the number is > 0, provide twiml output
    if (number > 0){
      var result = fizzbuzzcalculator(number);
      fizzBuzzer.say("Fizzbuzz has been calculated.").pause({ length: 2 }).say(result);
      fizzBuzzer.say("Thank you for using fizzbuzzer");
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(fizzBuzzer.toString());
    // else say error
    } else {
      fizzBuzzer.say("You have entered 0. Please enter a number greater than 0");
      res.writeHead(200, {'Content-Type': 'text/xml'});
      res.end(fizzBuzzer.toString());
    }

  } else {
    fizzBuzzer.say("You have made an invalid entry");
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(fizzBuzzer.toString());
  }
});

router.post('/caller', function(req, res) {
    var url = 'http://' + req.headers.host + '/phonebuzzer';
    var twilioclient = twilio(config.accountSid, config.authToken);
    var timeout = req.body.timedata;
    timeout = timeout / 1000;
    if ( timeout != 0 ) {
      res.send({
        message: "Calling in "+ timeout + " seconds"
      })
    }
    setTimeout( // Simple setTimeout function to handle delay
      function(){
        twilioclient.makeCall({
          to: req.body.phoneNum,
          from: config.twilioNumber,
          url: url
      }, function(err, message) {
          console.log(err);
          if (err) {
            res.status(500).send(err);
          } else {
            res.send({
                message: "Calling now"
            });
          }
      });      
      }, timeout);
});

module.exports = router;
