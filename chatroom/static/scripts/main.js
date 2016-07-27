
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
                        //var messageId = 0;
                        // Log responseObject
                        // Display the JSON query status
                        // Move the button out of the response div
                        //var getMessagesDiv = document.getElementById("messages");
						var invisible = document.getElementById("buttons");
						var buttons = document.getElementById("buttons");
						var likeButton = document.getElementById("likeButton");
						var reportButton = document.getElementById("reportButton");
						likeButton.style.display = "none";
						reportButton.style.display = "none";
						invisible.appendChild(likeButton);
						invisible.appendChild(reportButton);
						// Remove the current content in response div
						var messages = document.getElementById("response");
                        while(messages.firstChild) {
                            messages.removeChild(messages.firstChild);
                        }
                        // Display the JSON query messages
                        var msgs = responseObject.resp;
                            $.each(msgs , function(index){
                                var well_id = "m"+(index+1).toString();
                                var text = msgs[index][0];
                                var type = msgs[index][1];
								// Create a frame
								var messageFrame = document.createElement("div");
								messageFrame.setAttribute("id", "frame" + (index+1).toString());
								messageFrame.setAttribute("class", "row");
								messageFrame.setAttribute("onclick", "onMessageClicked(" + (index+1).toString() + ")");
								// Create a textWraper
								var messageTextWrapper = document.createElement("div");
								messageTextWrapper.setAttribute("class", "col-md-10");
								messageFrame.appendChild(messageTextWrapper);
								// Create a text m
								var messageTextDiv = document.createElement("div");
								messageTextDiv.setAttribute("id", "m" + (index+1).toString());
								messageTextDiv.setAttribute("class", "well-sm");
								messageTextWrapper.appendChild(messageTextDiv);
								// Put text into the text m
								var messageTextContent = document.createTextNode(text);
								messageTextDiv.appendChild(messageTextContent);
								// Put everything back to the message div
                                messages.appendChild(messageFrame);

                        });

                        // Put the buttons back beside the message
                        if(buttonAttachedID != -1) {
							buttons.style.display = "inline";
                            likeButton.style.display = "inline";
							reportButton.style.display = "inline";
                            var attachedMessageFrame = document.getElementById("frame" + buttonAttachedID.toString());
                            attachedMessageFrame.appendChild(buttons);
							buttons.appendChild(likeButton);
							buttons.appendChild(reportButton);
                        }
                    },
                    complete: function(){
                        setTimeout(function(){
                            get_messages(cid);
                        }, 1000);
                    },
                });
            };

    function onMessageClicked(messageId) {
        //window.alert(messageId.toString());
        //document.getElementById("p" + messageId.toString()).style.color = "black";
        // Get both buttons
		var buttons = document.getElementById('buttons');
        var likeButton = document.getElementById('likeButton');
        var reportButton = document.getElementById('reportButton');
        // Make them inline
		buttons.style.display = "inline";
        likeButton.style.display = "inline";
        reportButton.style.display = "inline";
        // Modify their onclick function
        likeButton.setAttribute("onclick", "messageLiked("+ messageId.toString()+")");
        reportButton.setAttribute("onclick", "messageReported("+ messageId.toString()+")");
        // Get the clicked message
        var clickedFrame = document.getElementById('frame' + messageId.toString());
        // Move both botton into the div with the clicked message
        clickedFrame.appendChild(buttons);
		buttons.appendChild(likeButton);
		buttons.appendChild(reportButton);
        // Update button display variable
        buttonAttachedID = messageId;
    }

    // Called when the "Like" button is clicked
    function messageLiked(messageId) {
        var likedMessage = document.getElementById("m" + messageId.toString());
        likedMessage.style.textDecoration = "underline";
    }

    function messageReported(messageId) {
        var reportMessage = document.getElementById("m" + messageId.toString());
        reportMessage.style.color = "black";
    }

    /* Hide both buttons if mouse click else where */
    $("body").click(function(event) {
			window.alert(event.target.id);
        /* Act on the event */
        if(event.target.nodeName != "P" && event.target.nodeName != "A" && event.target.nodeName != "DIV") {
            // Move the button out of the response div
            var invisibleDiv = document.getElementById("invisible");
			var buttons = document.getElementById("buttons");
            var likeButton = document.getElementById("likeButton");
            var reportButton = document.getElementById("reportButton");
			invisibleDiv.appendChild(buttons);
            buttons.appendChild(likeButton);
            buttons.appendChild(reportButton);
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
    
