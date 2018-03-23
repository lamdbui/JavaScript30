const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      // console.log(localMediaStream);
      // need to convert video into something that the video.src can understand (URL)
      video.src = window.URL.createObjectURL(localMediaStream);
      // video.src = HTMLMediaElement.srcObject(localMediaStream);
      video.play();
    })
    .catch(error => {
      console.error('Y U DENY WEBCAM?', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);

  // make sure the width and height match the canvas
  canvas.width = width;
  canvas.height = height;

  // capture image
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

function takePhoto() {
  // play the photo sound
  snap.currentTime = 0;
  snap.play();

  // capture the image out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

video.addEventListener('canplay', paintToCanvas);

getVideo();
