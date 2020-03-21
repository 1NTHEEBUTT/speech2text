const getPermission = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true
    })
    .then(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        var currTab = tabs[0];
        if (currTab) {
          chrome.tabs.remove(currTab);
        }
      });
    });
};

getPermission();
