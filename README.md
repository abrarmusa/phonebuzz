# Phonebuzzer


### A Twilio based node app that lets users:
### - Call the phone number, enter a number greater than 0 and then listen to the fizzbuzz result up to that number(*Note: Please keep
the number reasonably low for eg. 15 unless you want to hear the program speak out the result up to a big number, may be a bit annoying)
### - Use the web interface to input a number to which the app will make a phone call to run the Phonebuzzer app


======================================
======================================
## Phase 1
### In order to test out the app, please call +1 (709) 700-0754 and follow the instructions

### To run on your own, please input your twilio api credentials in ```config.js``` as below:

```javascript

module.exports = {
    accountSid: "TWILIO ACCOUNT SID HERE"
    authToken: "TWILI AUTH TOKEN HERE",
    twilioNumber: "TWILIO PHONE NUMBER HERE",
    port: process.env.PORT || 8000
};

```
### and host on your own server

======================================
## Phase 2

### In order to test out the app, please visit http://phonebuzzer.herokuapp.com/ and enter a phone number and click submit.


======================================
## Phase 3

### In order to test out the app, please visit http://phonebuzzer.herokuapp.com/ and enter a phone number and time click submit.
### Time should be entered like so "1 minute" or "2 minutes 4 seconds" or "1 hour" etc.



======================================
## Phase 4

### In order to test out the app, please visit http://phonebuzzer.herokuapp.com/ and enter a phone number and time click submit.
### Time should be entered like so "1 minute" or "2 minutes 4 seconds" or "1 hour" etc.
