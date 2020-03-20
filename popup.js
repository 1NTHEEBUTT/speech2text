navigator.webkitGetUserMedia(
  {
    audio: true
  },
  function(stream) {
    alert("successed");
    // Now you know that you have audio permission. Do whatever you want...
  },
  function() {
    alert("failed");
    // Aw. No permission (or no microphone available).
  }
);

var recognizing;
stop();
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onend = stop();
recognition.lang = "ja-JP";
recognition.onstart = e => showMessage("start");
//recognition.onaudiostart = e => showMessage("audio start");
//recognition.onsoundstart = e => showMessage("sound start");
recognition.onspeechstart = e => showMessage("speech start");
recognition.onspeechend = e => showMessage("speech end");
//recognition.onsoundend = e => showMessage("sound end");
//recognition.onaudioend = e => showMessage("audio end");
recognition.onend = e => showMessage("end");

recognition.onerror = e => showMessage("error");
recognition.onnomatch = e => showMessage("nomatch");

recognition.onresult = function(event) {
  console.log(event);
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      document.getElementById("output").value = event.results[i][0].transcript;
    } else {
      document.getElementById("interim").value = event.results[i][0].transcript;
    }
  }
};

function showMessage(msg) {
  document.getElementById("status").textContent = msg;
}

function stop() {
  recognizing = false;
}

function start() {
  recognizing = true;
}

$(document).ready(function() {
  document.getElementById("mic").addEventListener("click", function() {
    toggleStartStop();
  });
});

function toggleStartStop() {
  if (recognizing) {
    recognition.stop();
    showMessage("Click to speak");
    stop();
  } else {
    recognition.start();
    showMessage("Click to stop");
    start();
  }
}
