// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
var file = document.querySelector("[type='file']");
const canvas = document.getElementById('user-image');
const ctx = document.getElementById('user-image').getContext('2d');
const submitButton = document.querySelector("[type='submit']");
const form = document.getElementById('generate-meme');
const clear = document.querySelector("[type='reset']");
const voiceButton = document.querySelector("[type='button']");
const button = document.getElementById('voice-selection');
const slider = document.getElementById('volume-group');
button.disabled = false;
let speech = window.speechSynthesis;
let voiceType;
let voices;
let volume = 1;

//voices
function populateVoiceList() {
  if (typeof speechSynthesis === 'undefined') {
    return;
  }

  voices = speechSynthesis.getVoices();

  for (var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
      button.innerHTML = option.textContent;
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    button.appendChild(option);
  }

}

button.addEventListener('change', function (event) {
  const selectedVoice = event.target.selectedIndex;
  voiceType = voices[selectedVoice];
});

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

img.addEventListener('load', () => {
  // TODO
  const dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);

  //resetting image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //drawing image
  ctx.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);

  //toggling buttons
  submitButton.disabled = false;
  clear.disabled = true;
  voiceButton.disabled = true;
});


  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
img.addEventListener('load', () => {
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

file.addEventListener('change', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var url = URL.createObjectURL(file.files[0]);
  img.src = url;
  img.alt = url;
});

form.addEventListener('submit', function (event) {
  //grabbing two text inputs
  var topText = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  ctx.font = "20px Times New Roman";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeText(topText, canvas.width / 2, 25);
  ctx.fillText(topText, canvas.width / 2, 25);
  ctx.strokeText(bottomText, canvas.width / 2, 375);
  ctx.fillText(bottomText, canvas.width / 2, 375);

  //toggle
  submitButton.disabled = true;
  clear.disabled = false;
  voiceButton.disabled = false;
  event.preventDefault();
});

//onclick clear
clear.addEventListener('click', function (event) {

  //clearing image/text present
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //toggling buttons
  submitButton.disabled = false;
  clear.disabled = true;
  voiceButton.disabled = true;
});

//onclick read text
voiceButton.addEventListener('click', function () {
  var topText = document.getElementById('text-top').value;
  var bottomText = document.getElementById('text-bottom').value;
  var totalText = topText + " " + bottomText;
  let utterThis = new SpeechSynthesisUtterance(totalText);
  utterThis.voice = voiceType;
  utterThis.volume = volume;
  speech.speak(utterThis);
});

//change on volume slider
slider.addEventListener('change', function () {
  var image = document.querySelector('#volume-group img');
  var slideThing = document.querySelector("[type='range']");
  if (slideThing.value > 67 && slideThing.value < 100) {
    image.src = "icons/volume-level-3.svg";
  }
  if (slideThing.value > 34 && slideThing.value < 66) {
    image.src = "icons/volume-level-2.svg";
  }
  if (slideThing.value > 1 && slideThing.value < 33) {
    image.src = "icons/volume-level-1.svg";
  }
  if (slideThing.value == 0) {
    image.src = "icons/volume-level-0.svg";
  }
  volume = slideThing.value / 100;
});



// /**
//  * Takes in the dimensions of the canvas and the new image, then calculates the new
//  * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
//  */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}