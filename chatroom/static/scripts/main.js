
    // AJAX for posting
    function send_message(uid, cid, text) {
        console.log("send message is working!") // sanity check
        $.ajax({
            url : '/chatroom/post/',
            type : 'POST', // http method
            data: {uid: uid, cid: cid, text: text},
            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };

    function get_messages(cid) {
                $.ajax({
                    type: "GET",
                    url: 'http://127.0.0.1:8000/chatroom/get?cid=' + cid,
                    dataType: 'json',
                    // Process the data
                    success: function(responseObject){
                        console.log(responseObject);
                        // Display the JSON query status
                        document.getElementById("status").innerHTML = "Status: " + responseObject.status;
                        /* Put the elements back to the DOM */
                        var messages = document.getElementById("response");
                        while(messages.firstChild) {
                            messages.removeChild(messages.firstChild);
                        }

                        // Display the JSON query messages
                        var msgs = responseObject.resp;
                            $.each(msgs , function(index){
                                var text = msgs[index][0];
                                var type = msgs[index][1];
                                var messageContentP = document.createElement("p");  // <p>
                                var messageContentText = document.createTextNode("Message " + text); // Get the text to display
                                /* Put the text into the <p> element */
                                messageContentP.appendChild(messageContentText);
                                /* Set the color based on the message type */
                                if(type == "n") {
                                    messageContentP.style.color = "green";
                                } else {
                                    messageContentP.style.color = "grey";
                                }
                                messages.appendChild(messageContentP);

                        });

                        /* Get the current timestamp */
                        var timestamp = Date.now();
                        document.getElementById("timestamp").innerHTML = timestamp.toString();
                    },
                    complete: function(){
                        setTimeout(function(){
                            get_messages(cid);
                        }, 2000);
                    },
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
    };
    