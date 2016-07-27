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
// window.addEventListener("load", function() { alert("hello!");});

// $(function() {
    // window.onload = getLocation();
    var position;

    function getLocation(){
        if (navigator.geolocation){
            console.log("get geo location!");
            navigator.geolocation.getCurrentPosition(showPosition);
        }
        else{
            console.log("Not get geo location!");
            window.location.href = '/chatroom/create?x=-1&y=-1';
        }
    }

    function showPosition(tmp_position) {
        position = tmp_position
        window.location.href = '/chatroom/create?x=' + position.coords.latitude + '&y=' + position.coords.longitude;
    }

    // Submit post on submit
    // $('#message-form').on('submit', function(event){
    //     event.preventDefault();
    //     console.log("form submitted!")  // sanity check
    //     send_message();
    // });

    // AJAX for posting
    function send_message(uid, cid, text) {
        console.log("send message is working!"); // sanity check
        console.log(text+uid+cid);
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


            // error : function(xhr,errmsg,err) {
            //     $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
            //         " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            //     console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            // }
        });
    };


// });