$(function() {
    // Prevent form submission and submit using ajax
    $('#phoneForm').on('submit', function(e) {
        // Stop event bubbling
        e.preventDefault();
        var phonenumber = $('#pnum').val();
        $.ajax({
            url: '/caller',
            method: 'POST',
            dataType: 'json',
            data: {
                phoneNum: phonenumber
            }
        }).done(function(data) {
            alert(data.message);
        }).fail(function(error) {
            alert(JSON.stringify(error));
        });
    });


});