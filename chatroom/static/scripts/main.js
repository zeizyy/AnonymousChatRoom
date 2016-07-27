
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
    