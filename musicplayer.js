const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const musicContainer = document.getElementById('music-container');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');

let isPlaying = false;

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
  audio.play();
  isPlaying = true;
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i').classList.replace('fa-pause', 'fa-play');
  audio.pause();
  isPlaying = false;
}

playBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

audio.addEventListener('timeupdate', (e) => {
  const { duration, currentTime } = e.srcElement;
  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
});

progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Dragging functionality
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

musicContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - musicContainer.getBoundingClientRect().left;
  offsetY = e.clientY - musicContainer.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    musicContainer.style.left = `${e.clientX - offsetX}px`;
    musicContainer.style.top = `${e.clientY - offsetY}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
