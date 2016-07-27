
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

    /* Global variable */
    //var buttonsShown = false;
    var buttonAttachedID = -1;

    function get_messages(cid) {
                $.ajax({
                    type: "GET",
                    url: '/chatroom/get?cid=' + cid,
                    dataType: 'json',
                    // Process the data
                    success: function(responseObject){
                        // Fake message ID
                        var messageId = 0;
                        // Log responseObject
                        console.log(responseObject);
                        // Display the JSON query status
                        document.getElementById("status").innerHTML = "Status: " + responseObject.status;
                        // Move the button out of the response div
                        var getMessagesDiv = document.getElementById("getMessages");
                        var likeButton = document.getElementById("likeButton");
                        var reportButton = document.getElementById("reportButton");
                        getMessagesDiv.appendChild(likeButton);
                        getMessagesDiv.appendChild(reportButton);
                        likeButton.style.display = "none";
                        reportButton.style.display = "none";
                        // Update button display variable
                        //buttonsShown = false;
                        // Remove the current content
                        var messages = document.getElementById("response");
                        while(messages.firstChild) {
                            messages.removeChild(messages.firstChild);
                        }
                        // Display the JSON query messages
                        var msgs = responseObject.resp;
                            $.each(msgs , function(index){
                                var text = msgs[index][0];
                                var type = msgs[index][1];
                                var messageContentDiv = document.createElement("div");  // <div>
                                var messageContentP = document.createElement("p");  // <p>
                                messageContentDiv.appendChild(messageContentP);
                                messageContentDiv.setAttribute("id", "div" + messageId.toString()); // Assign the message id to the <div> element
                                messageContentDiv.setAttribute("onclick", "onMessageClicked(" + messageId.toString() + ")");    // Set the onclick function
                                messageContentP.setAttribute("id", "p" + messageId.toString()); // Assign the message id to the <p> element
                                messageContentP.style.display = "inline";   // Make the message display as inline element
                                messageId++;    // Update messageId
                                var messageContentText = document.createTextNode("Message " + text); // Get the text to display
                                /* Put the text into the <p> element */
                                messageContentP.appendChild(messageContentText);
                                /* Set the color based on the message type */
                                if(type == "n") {
                                    messageContentP.style.color = "grey";
                                } else if(type == "l") {
                                    messageContentP.style.color = "red";
                                } else {
                                    messageContentP.style.color = "green";
                                }
                                messages.appendChild(messageContentDiv);

                        });

                        // Put the buttons back beside the message
                        if(buttonAttachedID != -1) {
                            likeButton.style.display = "inline";
                            reportButton.style.display = "inline";
                            var attachedMessageDiv = document.getElementById("div" + buttonAttachedID.toString());
                            attachedMessageDiv.appendChild(likeButton);
                            attachedMessageDiv.appendChild(reportButton);
                        }

                        /* Get the current timestamp */
                        var timestamp = Date.now();
                        document.getElementById("timestamp").innerHTML = timestamp.toString();
                    },
                    complete: function(){
                        setTimeout(function(){
                            get_messages(cid);
                        }, 20000/*2000*/);
                    },
                });
            };

    function onMessageClicked(messageId) {
        //window.alert(messageId.toString());
        //document.getElementById("p" + messageId.toString()).style.color = "black";
        // Get both buttons
        var likeButton = document.getElementById('likeButton');
        var reportButton = document.getElementById('reportButton');
        // Make them inline
        likeButton.style.display = "inline";
        reportButton.style.display = "inline";
        // Modify their onclick function
        likeButton.setAttribute("onclick", "messageLiked("+ messageId.toString()+")");
        reportButton.setAttribute("onclick", "messageReported("+ messageId.toString()+")");
        // Get the clicked message
        var clickedDiv = document.getElementById('div' + messageId.toString());
        // Move both botton into the div with the clicked message
        clickedDiv.appendChild(likeButton);
        clickedDiv.appendChild(reportButton);
        // Update button display variable
        buttonAttachedID = messageId;
    }

    // Called when the "Like" button is clicked
    function messageLiked(messageId) {
        var likedMessage = document.getElementById("p" + messageId.toString());
        likedMessage.style.textDecoration = "underline";
    }

    function messageReported(messageId) {
        var reportMessage = document.getElementById("p" + messageId.toString());
        reportMessage.style.color = "black";
    }

    /* Hide both buttons if mouse click else where */
    $("body").click(function(event) {
        /* Act on the event */
        //window.alert(event.target.nodeName);
        if(/*buttonsShown && */event.target.nodeName != "P" && event.target.nodeName != "BUTTON") {
            // Move the button out of the response div
            var getMessagesDiv = document.getElementById("getMessages");
            var likeButton = document.getElementById("likeButton");
            var reportButton = document.getElementById("reportButton");
            getMessagesDiv.appendChild(likeButton);
            getMessagesDiv.appendChild(reportButton);
            likeButton.style.display = "none";
            reportButton.style.display = "none";
            // Update button display variable
            buttonAttachedID = -1;
        }
    });

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
    