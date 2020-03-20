var recognizing;
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
reset();
recognition.onend = reset;
recognition.lang = "ja";
recognition.onresult = function(event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      document.getElementsByClassName("output")[0].value +=
        event.results[i][0].transcript;
    }
  }
};

$(document).ready(function() {
  document
    .getElementsByClassName("mic")[0]
    .addEventListener("click", function() {
      toggleStartStop();
    });
});

function reset() {
  recognizing = false;
  console.log("click to speak");
  //document.getElementsByClassName("output")[0].innerHTML = "Click to Speak";
}

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    reset();
  } else {
    recognition.start();
    recognizing = true;
    console.log("click to stop");
    //document.getElementsByClassName("output")[0].innerHTML = "Click to Stop";
  }
}
