var express = require('express');
var config = require('../config.js');
var router = express();
var twilio = require('twilio');
var fizzbuzzcalculator = require('../public/javascripts/fizzbuzz.js');
var mongoose = require('mongoose');
var Calls = require('../models/calls.js');
var options = {
        upsert: true,
        sort: {'calltime': -1 } 
    }
    /* GET home page. */
router.get('/', function(req, res) {
    var calllist;
    Calls.find({}, 'phonenumber digits delay calltime', function(err, calls) {
        if (err) throw err;
        // calllist = JSON.parse(calls);
    }).sort({
        calltime: -1
    }).exec(function(err, calls) {
        calllist = calls.map(function(call) {
            return call.toJSON();
        });
    }).then(function() {
        res.render('index', {
            calllist: calllist
        });
    })

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
            this.say('Please enter a number greater than 0 to run fizzbuzz. Press pound after you have finished entering the number.')
        });
        res.type('text/xml');
        res.send(resp.toString());
    } else {
        res.status(403).send('This is not a twilio request! Only requests from twilio are accepted');
    }
});

// Endpoint for fizzbuzz output through Twilio
router.post('/fizzbuzz', function(req, res) {
    var digits;
    var callLogger;
    if (req.body.Digits) {
        callLogger = Calls.findOneAndUpdate({
            phonenumber: req.body.Called
        }, {
            digits: req.body.Digits
        }).exec(function(err, call) {
            digits = req.body.Digits;
        });
    } else {
        callLogger = Calls.findOne({
            phonenumber: req.body.Called
        }).sort('-calltime').exec(function(err, call) {
            digits = call.digits;
        })
    };
    
    callLogger.then(function() {
        if (parseInt(digits) > -1) {
            var number = digits;
            number = parseInt(number);
            var fizzBuzzer = new twilio.TwimlResponse();
            // If the number is > 0, provide twiml output
            if (number > 0) {
                var result = fizzbuzzcalculator(number);
                fizzBuzzer.say("Fizzbuzz has been calculated.").pause({
                    length: 2
                }).say(result).say("Thank you for using fizzbuzzer");
            } else {
                fizzBuzzer.say("You have entered 0. Please enter a number greater than 0");
            }
        } else {
            fizzBuzzer.say("You have made an invalid entry");
        }
        res.writeHead(200, {
            'Content-Type': 'text/xml'
        });
        res.end(fizzBuzzer.toString());
    });
});


// Caller route opened when user used interface on website
router.post('/caller', function(req, res) {
    var url = 'http://' + req.headers.host + '/phonebuzzer';
    var twilioclient = twilio(config.accountSid, config.authToken);
    var delay = req.body.delay;
    var digits = 0;
    var phonenum = req.body.phoneNum;
    // Get most recent call by number and highest calltime
    var callLogger = Calls.findOne({
        phonenumber: phonenum
    }).sort('-calltime').exec(function(err, call) {
        if (call != null) {
            digits = call.digits;
            delay = call.delay;
        }
    });

    callLogger.then(function() {
        if (parseInt(digits) > 0) {
            url = 'http://' + req.headers.host + '/fizzbuzz';
        }
        if (delay != 0) {
            res.send({
                message: "Calling in " + (delay/1000) + " seconds"
            })
        } else {
            res.send({
                message: "Calling now"
            });
        }
        setTimeout(function() {
            var milliseconds = (new Date).getTime();
            twilioclient.makeCall({
                to: phonenum,
                from: config.twilioNumber,
                url: url
            }, function(err, responsedata) {
                var currentcall = new Calls({
                    phonenumber: phonenum,
                    digits: digits,
                    delay: delay,
                    calltime: milliseconds
                });
                currentcall.save(function(err) {
                
                });
                if (err) {
                    res.status(500).send(err);
                }
            });
        }, delay);
    })

});

module.exports = router;