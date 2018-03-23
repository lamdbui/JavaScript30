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
    let pixels = ctx.getImageData(0, 0, width, height);
    // do some filtering
    // pixels = redEffect(pixels);
    pixels = rgbSplit(pixels);
    // add ghosting effect
    ctx.globalAlpha = 0.1;
    ctx.putImageData(pixels, 0, 0);
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

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0];    // r
    pixels.data[i + 100] = pixels.data[i + 1];    // g
    pixels.data[i - 150] = pixels.data[i + 2];    // b
    // pixels.data[i + 3] // a

  }
  return pixels;
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] += 100;   // r
    pixels.data[i + 1] -= 50;    // g
    pixels.data[i + 2] *= 0.5;   // b
    // pixels.data[i + 3] // a

  }
  return pixels;
}

video.addEventListener('canplay', paintToCanvas);

getVideo();
