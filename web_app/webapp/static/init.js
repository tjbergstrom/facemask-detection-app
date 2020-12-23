// stream.js
// Initialize the webcam stream and display it


function connect_cam(vid_element) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(function(stream) {
            vid_element.srcObject = stream;
        }).catch(function(error) {
            console.log(error);
        });
    }
}


function init_stream(stream_type, vid_player) {
    let streamSource = localStorage.streamSource;
    connect_cam(vid_player)
}


let stream_type = localStorage.stream_type;
let video = document.querySelector("#video");
init_stream(stream_type, video);



//
