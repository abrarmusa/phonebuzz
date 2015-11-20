$(function() {
    // Prevent form submission and submit using ajax
    $('#phoneForm').on('submit', function(e) {
        // Stop event bubbling
        e.preventDefault();
        var timeinmil = timeParser($("#timeval").val().toString());
        // Check if it is an integer value, else set to 0
        if ( timeinmil !== parseInt(timeinmil, 10) ) {
            timeinmil = 0;
        }
        console.log(timeinmil);
        $.ajax({
            url: '/caller',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNum: $('#pnum').val(),
                delay: timeinmil
            }
        }).done(function(data) {
            // Success alert
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
    });

    $('#makecall').on('click', function(e) {
        // Stop event bubbling
        e.preventDefault();
        var delay = (parseInt($(this).parent().parent().find("#delay2").text())/1000).toString();
        delay += " seconds";
        var timeinmil = timeParser(delay);
        // Check if it is an integer value, else set to 0
        if ( timeinmil !== parseInt(timeinmil, 10) ) {
            timeinmil = 0;
        }
        console.log(timeinmil);
        $.ajax({
            url: '/caller',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNum: $(this).parent().parent().find("#pnum2").text(),
                delay: timeinmil
            }
        }).done(function(data) {
            // Success alert
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
        $.ajax({
            url: '/calls',
            method: 'GET'
        }).done(function(data) {
            // Success alert
            alert(data.message);
        })
        
    });

    // Parses the string to get the time in milliseconds
    function timeParser(timestring){
        console.log(timestring);
        var res = timestring.split(" ");
        var timeinmil = 0;
        var buff;
        for (i = 0; i < res.length; i = i+2 ) {
            console.log( res[i] );
            console.log( parseInt( res[i] ));
            buff = parseInt( res[i] ) * secondCheck(res[i+1]);
            timeinmil += buff;
        }

        return timeinmil;
    }
    // Checks for hours, minutes and seconds to output correct value for millisecond calculation
    function secondCheck(str){
        str = str.toLowerCase();
        if ( (str == "minute") || (str == "minutes") ) {
            return (1000*60)
        } else if ( (str == "second") || (str == "seconds") ) {
            return 1000
        } else if ( (str == "hour") || (str == "hours") ) {
            return (1000*60*60)
        } else {
            alert("Please enter a correct input for time");
        }
    }


});