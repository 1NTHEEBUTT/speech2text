import { getDefaultSettings } from "http2";

const recognition = new webkitSpeechRecognition();
let recognizing;
let translateTo;
const translationUrlBase =
  "https://script.google.com/macros/s/AKfycbzzIkZeCHyoajJgiQLspwNeBkeAK61NCYfCXbNlnQ/exec";

const getPermission = () => {
  const permissionUrl = `chrome-extension://${chrome.runtime.id}/getPermission.html`;
  chrome.tabs.create({ url: permissionUrl });
};

const initializeRecognition = () => {
  const statuses = [
    "start",
    "audiostart",
    "soundstart",
    "speechstart",
    "speechend",
    "soundend",
    "audioend",
    "end"
  ];
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onstart = e => {
    showMessage("start");
    recognition.status = "start";
    iconForLoading();
  };
  recognition.onaudiostart = e => {
    showMessage("audio start");
    recognition.status = "audiostart";
  };
  recognition.onsoundstart = e => {
    showMessage("sound start");
    recognition.status = "soundstart";
  };
  recognition.onspeechstart = e => {
    showMessage("speech start");
    recognition.status = "speechstart";
    iconForReady();
  };
  recognition.onspeechend = e => {
    showMessage("speech end");
    recognition.status = "speechend";
    iconForStop();
  };
  recognition.onsoundend = e => {
    showMessage("sound end");
    if (recognition.status != "speechend") {
      showMessage(`[Error] Latest status is ${recognition.status}`);
      iconForStop();
    }
    recognition.status = "soundend";
  };
  recognition.onaudioend = e => {
    showMessage("audio end");
    if (recognition.status != "soundend") {
      showMessage(`[Error] Latest status is ${recognition.status}`);
      iconForStop();
    }
    recognition.status = "audioend";
  };
  recognition.onend = e => {
    showMessage("end");
    if (recognition.status != "audioend") {
      showMessage(`[Error] Latest status is ${recognition.status}`);
      iconForStop();
    }
    recognition.status = "end";
    recognizing = false;
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
      if (event.results[i].isFinal) {
        $("#result").text(transcript);
        $("#interim").text("");
        translate(transcript, recognition.lang, translateTo);
        navigator.clipboard.writeText(`${transcript}\n`);
        saveHistory(transcript, "original");
      } else {
        $("#interim").text(transcript);
      }
    }
  };
};

const iconForStop = () => {
  $(".fa-microphone-slash").css("display", "block");
  $(".fa-microphone.loading").css("display", "none");
  $(".fa-microphone.ready").css("display", "none");
};

const iconForLoading = () => {
  $(".fa-microphone-slash").css("display", "none");
  $(".fa-microphone.loading").css("display", "block");
  $(".fa-microphone.ready").css("display", "none");
};

const iconForReady = () => {
  $(".fa-microphone-slash").css("display", "none");
  $(".fa-microphone.loading").css("display", "none");
  $(".fa-microphone.ready").css("display", "block");
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

const langs = {
  Afrikaans: "af-ZA",
  "Bahasa Indonesia": "id-ID",
  "Bahasa Melayu": "ms-MY",
  Català: "ca-ES",
  Čeština: "cs-CZ",
  Deutsch: "de-DE",
  "English [Australia]": "en-AU",
  "English [Canada]": "en-CA",
  "English [India]": "en-IN",
  "English [New Zealand]": "en-NZ",
  "English [South Africa]": "en-ZA",
  "English [United Kingdom]": "en-GB",
  "English [United State]": "en-US",
  "Español [Argentina]": "es-AR",
  "Español [Bolivia]": "es-BO",
  "Español [Chile]": "es-CL",
  "Español [Colombia]": "es-CO",
  "Español [Costa Rica]": "es-CR",
  "Español [Ecuador]": "es-EC",
  "Español [El Salvador]": "es-SV",
  "Español [España]": "es-ES",
  "Español [Estados Unidos]": "es-US",
  "Español [Guatemala]": "es-GT",
  "Español [Honduras]": "es-HN",
  "Español [México]": "es-MX",
  "Español [Nicaragua]": "es-NI",
  "Español [Panamá]": "es-PA",
  "Español [Paraguay]": "es-PY",
  "Español [Perú]": "es-PE",
  "Español [Puerto Rico]": "es-PR",
  "Español [República Dominicana]": "es-DO",
  "Español [Uruguay]": "es-UY",
  "Español [Venezuel]": "es-VE",
  Euskara: "eu-ES",
  Français: "fr-FR",
  Galego: "gl-ES",
  Hrvatski: "hr_HR",
  IsiZulu: "zu-ZA",
  Íslenska: "is-IS",
  "Italiano [Italia]": "it-IT",
  "Italiano [Svizzera]": "it-CH",
  Magyar: "hu-HU",
  Nederlands: "nl-NL",
  "Norsk bokmål": "nb-NO",
  Polski: "pl-PL",
  "Português [Brasil]": "pt-BR",
  "Português [Portugal]": "pt-PT",
  Română: "ro-RO",
  Slovenčina: "sk-SK",
  Suomi: "fi-FI",
  Svenska: "sv-SE",
  Türkçe: "tr-TR",
  български: "bg-BG",
  Pусский: "ru-RU",
  Српски: "sr-RS",
  한국어: "ko-KR",
  "中文 [普通话 (中国大陆)": "cmn-Hans-CN",
  "中文 [普通话 (香港)]": "cmn-Hans-HK",
  "中文 (台灣)": "cmn-Hant-TW",
  "中文 [粵語 (香港)]": "yue-Hant-HK",
  日本語: "ja-JP",
  "Lingua latīna": "la"
};

const code2lang = code => {
  for (let key in langs) {
    if (langs[key] === code) {
      return key;
    }
  }
};

const saveCountrySelection = e => {
  const selectedLangCountry = Object.keys(langs)[e.target.selectedIndex];
  recognition.lang = langs[selectedLangCountry];
  stop();
  chrome.storage.sync.set({
    code: langs[selectedLangCountry]
  });
};

const saveTranslateTargetSelection = e => {
  const selectedTranslateTaregtCountry = Object.keys(langs)[
    e.target.selectedIndex
  ];
  translateTo = langs[selectedTranslateTaregtCountry];
  stop();
  chrome.storage.sync.set({
    translateTarget: langs[selectedTranslateTaregtCountry]
  });
};

const addLangSelection = () => {
  chrome.storage.sync.get("code", selected => {
    const selectedCode = selected.code;
    recognition.lang = selectedCode;
    const langSelection = $("#langSelection");
    const dropdown = $("<select></select>");
    for (let country in langs) {
      let langOption = $("<option></option>")
        .text(country)
        .val(langs[country]);
      if (langs[country] === selectedCode) {
        langOption.prop("selected", true);
      }
      dropdown.append(langOption);
    }
    langSelection.append(dropdown);
    dropdown.on("change", saveCountrySelection);
  });
};

const addTranslateTargetSelection = () => {
  chrome.storage.sync.get("translateTarget", selected => {
    const selectedCode = selected.translateTarget;
    translateTo = selectedCode;
    const langSelection = $("#translateTargetSelection");
    const dropdown = $("<select></select>");
    for (let country in langs) {
      let langOption = $("<option></option>")
        .text(country)
        .val(langs[country]);
      if (langs[country] === selectedCode) {
        langOption.prop("selected", true);
      }
      dropdown.append(langOption);
    }
    langSelection.append(dropdown);
    dropdown.on("change", saveTranslateTargetSelection);
  });
};

const translate = (text, source, target) => {
  const sourceCode = source.split("-")[0];
  const targetCode = target.split("-")[0];
  fetch(
    `${translationUrlBase}?text=${text}&source=${sourceCode}&target=${targetCode}`,
    { mode: "no-cors" }
  )
    .then(res => {
      return res.json();
    })
    .then(res => {
      const translated = res.translated;
      $("#translated").text(translated);
      let now = new Date();
      const result = {
        original: text,
        translated: translated,
        source: source,
        target: target,
        date: getDate()
      };
      saveHistory(result);
    })
    .catch(e => {
      console.log(e);
    });
};
const getDate = () => {
  const date = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hour: now.getHours(),
    min: now.getMinutes(),
    sec: now.getSeconds()
  };
  return date;
};
const saveHistory = result => {
  chrome.storage.sync.get(history, res => {
    chrome.storage.sync.set({
      history: res
    });
  });
};

const loadHistory = () => {
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
      let val = changes[key].newValue;
      let leftBlock = $("<div></div>", { addClass: "original" });
      let rightBlock = $("<div></div>", { addClass: "translated" });
      let textBlock = $("<span></span>", { addClass: "textBlock" });
      let langCountry = $("<div></div>", { addClass: "usedLangCountry" });
      let langCode = $("<div></div>", { addClass: "usedLangCode" });
      let recordedDate = $("<span></span>", { addClass: "recordedDate" });
      $("#history").text(newValue);
    }
  });
};

const enableCopyOnClickResults = () => {
  $(document).on("click", "#result", () => {
    const text = $("#result").text();
    navigator.clipboard.writeText(`${text}\n`);
  });
  $(document).on("click", "#translated", () => {
    const text = $("#translated").text();
    navigator.clipboard.writeText(`${text}\n`);
  });
};

addLangSelection();
addTranslateTargetSelection();
iconForStop();
initializeRecognition();
loadHistory();
enableCopyOnClickResults();
setTimeout(start, 1000);
