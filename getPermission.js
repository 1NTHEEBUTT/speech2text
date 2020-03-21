const getPermission = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true
    })
    .then(console.log("test"));
};

getPermission();
