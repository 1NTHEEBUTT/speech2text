const recognition = new webkitSpeechRecognition();
let recognizing;

const initializeRecognition = () => {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "ja-JP";
  recognition.onstart = e => showMessage("start");
  recognition.onaudiostart = e => {
    showMessage("audio start");
    $(".fa-microphone-slash").css("display", "none");
    $(".fa-microphone.loading").css("display", "block");
  };
  recognition.onsoundstart = e => showMessage("sound start");
  recognition.onspeechstart = e => {
    showMessage("speech start");
    $(".fa-microphone.loading").css("display", "none");
    $(".fa-microphone.ready").css("display", "block");
  };
  recognition.onspeechend = e => {
    showMessage("speech end");
    $(".fa-microphone.ready").css("display", "none");
    $(".fa-microphone-slash").css("display", "block");
  };
  recognition.onsoundend = e => showMessage("sound end");
  recognition.onaudioend = e => showMessage("audio end");
  recognition.onend = e => {
    stop();
    showMessage("end");
  };

  recognition.onerror = e => showMessage(e);
  recognition.onnomatch = e => showMessage("nomatch");

  recognition.onresult = event => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      let transcript = event.results[i][0].transcript;
      event.results[i].isFinal
        ? $("#result").val(transcript)
        : $("#interim").val(transcript);
    }
  };
};

const initializeIcons = () => {
  $(".fa-microphone.ready").hide();
  $(".fa-microphone.loading").hide();
};

const getPermission = () => {
  navigator.webkitGetUserMedia(
    {
      audio: true
    },
    stream => {
      console.log(stream);
      // Now you know that you have audio permission. Do whatever you want...
    },
    () => {
      // Aw. No permission (or no microphone available).
    }
  );
};

const showMessage = msg => {
  console.log(msg);
};

const stop = () => {
  recognition.stop();
  recognizing = false;
};

const start = () => {
  recognition.start();
  recognizing = true;
};

const toggleStartStop = () => {
  recognizing ? stop() : start();
};

$(document).on("click", ".statusIcon", () => {
  toggleStartStop();
});

getPermission();
initializeIcons();
initializeRecognition();
