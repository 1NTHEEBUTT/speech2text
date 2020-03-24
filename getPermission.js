const getPermission = () => {
  navigator.mediaDevices.getUserMedia({
    audio: true
  });
};

getPermission();
