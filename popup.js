const recognition = new webkitSpeechRecognition();
let recognizing;

const getPermission = () => {
  const permissionUrl = `chrome-extension://${chrome.runtime.id}/getPermission.html`;
  chrome.tabs.create({ url: permissionUrl });
};

const initializeRecognition = () => {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "ja-JP";
  recognition.onstart = e => {
    showMessage("start");
    recognition.status = "start";
  };
  recognition.onaudiostart = e => {
    showMessage("audio start");
    recognition.status = "audiostart";
    $(".fa-microphone-slash").css("display", "none");
    $(".fa-microphone.loading").css("display", "block");
  };
  recognition.onsoundstart = e => {
    showMessage("sound start");
    recognition.status = "soundstart";
  };
  recognition.onspeechstart = e => {
    showMessage("speech start");
    recognition.status = "speechstart";
    $(".fa-microphone.loading").css("display", "none");
    $(".fa-microphone.ready").css("display", "block");
  };
  recognition.onspeechend = e => {
    showMessage("speech end");
    recognition.status = "speechend";
    $(".fa-microphone.ready").css("display", "none");
    $(".fa-microphone-slash").css("display", "block");
  };
  recognition.onsoundend = e => {
    showMessage("sound end");
    recognition.status = "soundend";
  };
  recognition.onaudioend = e => {
    showMessage("audio end");
    recognition.status = "audioend";
  };
  recognition.onend = e => {
    stop();
    showMessage("end");
    recognition.status = "end";
  };

  recognition.onerror = e => {
    if (e.error === "not-allowed") {
      getPermission();
    }
  };
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

initializeIcons();
initializeRecognition();
