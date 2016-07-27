
// AJAX for posting
function send_message(uid, cid, text) {
    console.log("send message is working!"); // sanity check
    $.ajax({
        method: "POST",
        url : 'http://127.0.0.1:8000/chatroom/post/',
        // type : "POST", // http method
        data: {uid: uid, cid: cid, text: text},
        async: true,
        cache: false,
        // handle a non-successful response
        success: function(json){
            console.log(JSON.stringify(json));
        },


        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};


