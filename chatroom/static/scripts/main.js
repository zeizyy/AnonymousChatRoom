// function sendMessage(uid, cid, message, position){
//     $.ajax({
//         url: '/chatroom/create?x=' + position.coords.latitude + '&y=' + position.coords.longitude,
//         type: 'POST',
//         dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
//         data: {uid: uid, cid: cid, message: message},
//         async: true,
//         cache: false,
//         timeout: 1000,
//     })
//     .done(function() {
//         console.log("success");
//     })
//     .fail(function() {
//         alert("Message not sent!");
//     })
//     .always(function() {
//         console.log("complete");
//     });
    
// }


    function getLocation(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
            window.location.href = '/chatroom/create?x=-1&y=-1';
        }
    }

    function showPosition(tmp_position) {
        position = tmp_position
        window.location.href = '/chatroom/create?x=' + position.coords.latitude + '&y=' + position.coords.longitude;
    }

    // Submit post on submit
    $('#message-form').on('submit', function(event){
        event.preventDefault();
        console.log("form submitted!")  // sanity check
        send_message();
    });

    // AJAX for posting
    function send_message() {
        console.log("send message is working!") // sanity check
        $.ajax({
            url : '/chatroom/create?x=' + position.coords.latitude + '&y=' + position.coords.longitude,
            type : "POST", // http method
            data: {uid: uid, cid: cid, message: $('#mesage-text').val()},
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };

    function get_messages() {
                $.ajax({
                    type: "GET",
                    url: 'http://127.0.0.1:8000/chatroom/get/',
                    dataType: 'json',
                    // Process the data
                    success: function(responseObject) {
                        // Display the JSON query status
                        document.getElementById("status").innerHTML = "Status: " + responseObject.status;
                        /* Put the elements back to the DOM */
                        var messages = document.getElementById("response");
                        while(messages.firstChild) {
                            messages.removeChild(messages.firstChild);
                        }
                        // Display the JSON query messages
                        for(i = 0; i < responseObject.resp.length; i++) {
                            // Create an entry for the message
                            var messageContentP = document.createElement("p");  // <p>
                            var messageContentText = document.createTextNode("Message " + i.toString() + ": " + responseObject.resp[i][0]); // Get the text to display
                            /* Put the text into the <p> element */
                            messageContentP.appendChild(messageContentText);
                            var messageType = responseObject.resp[i][1];
                            /* Set the color based on the message type */
                            if(messageType == "n") {
                                messageContentP.style.color = "green";
                            } else {
                                messageContentP.style.color = "grey";
                            }
                            messages.appendChild(messageContentP);
                        }
                        /* Get the current timestamp */
                        var timestamp = Date.now();
                        document.getElementById("timestamp").innerHTML = timestamp.toString();
                    }
                });
            };


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
