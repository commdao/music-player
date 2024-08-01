let tracks = {
    1: {
        path: 'media/tracks/1 - Melty Blood Basilica.mp3',
        duration: '3:07',
        name: 'Melty Blood Basilica [Type B: 1-2]',
        photo: 'media/album-art/1.jpg'
    },
    2: {
        path:'media/tracks/2 - Private Room.m4a',
        duration: '3:26',
        name: 'Private Room in the Velvet Room',
        photo: 'media/album-art/2.jpg'
    },
    3: {
        path:'media/tracks/3 - Tie a Cherry.m4a',
        duration:'3:09',
        name:'CL - Tie a Cherry (BlackJackJonny Remix)',
        photo: 'media/album-art/3.jpg'
    },
    4: {
        path:'media/tracks/4 - Garibaldi Temple Remix.m4a',
        duration:'1:56',
        name: 'Garibaldi Temple Remix',
        photo: 'media/album-art/4.jpg'
    },
    5: {
        path:'media/tracks/5 - Horny Chiptune.m4a',
        duration:'2:25',
        name:"Mousse T vs Hot'n'Juicy - Horny (Chiptune Remix)",
        photo: 'media/album-art/5.jpg'
    },
    6: {
        path:'media/tracks/6 - Winter Sonata.m4a',
        duration:'4:24',
        name:'Winter Sonata',
        photo: 'media/album-art/6.jpg'
    },
    7: {
        path:'media/tracks/7 - Tulibu Dibu Douchu.m4a',
        duration:'1:05',
        name:'Tulibu Dibu Douchu',
        photo: 'media/album-art/7.jpg'
    },
    8: {
        path:'media/tracks/8 - HBV.mp3',
        duration:'1:02',
        name:'HBV',
        photo: 'media/album-art/8.jpg'
    }, 
};

// Create an array of audio file URLs
const audioFiles = Object.values(tracks).map(track => track.path);
// Do the same for album art sources
const albumArt = Object.values(tracks).map(track => track.photo);

// Function to preload audio files > still not sure if this helps anything
function preloadAudio(audioFiles) {
    audioFiles.forEach(file => {
      const audio = new Audio();
      audio.src = file;
      audio.preload = 'auto';
    });
  }
  
  // Call the preload function
  preloadAudio(audioFiles);

const currentTrackName = document.getElementById('currentTrackName');
const audioPlayer = new Audio();
let isAudioLoaded = false;

audioPlayer.addEventListener('canplay', () => {
    isAudioLoaded = true;
    updateProgressBar();
});


function playTrack(trackPath) {
    const currentTrack = tracks[currentTrackIndex + 1];
    const albumArtPath = currentTrack.photo;
    
    audioPlayer.src = trackPath;
    audioPlayer.load();
    audioPlayer.play().catch(() => {
        console.log("Error: The play request was interrupted.")
    });
    const songPhotoElement = document.querySelector('.song-photo');
    songPhotoElement.style.backgroundImage = `url(${albumArtPath})`;

    playButton.innerHTML = `<i class="fa fa-pause fa-lg" aria-hidden="true"></i>`;
}

const playButton = document.getElementById('playIcon');
playButton.addEventListener('click', togglePlay);

function togglePlay() {
    if (audioPlayer.paused) {
        if (!audioPlayer.src) {
            currentTrackIndex = 0;
            const firstTrack = tracks[currentTrackIndex + 1];
            playTrack(firstTrack.path);
        } else {
            audioPlayer.play(); // Play the audio
        }
        playButton.innerHTML = '<i class="fa fa-pause fa-lg" aria-hidden="true"></i>'; // Update the play icon to pause icon
    } else {
        audioPlayer.pause(); // Pause the audio
        playButton.innerHTML = '<i class="fa fa-play fa-lg" aria-hidden="true"></i>'; // Update the pause icon to play icon
    }
}

// hover play button
document.querySelectorAll('.track').forEach((track, index) => {
    track.addEventListener('click', () => {
        currentTrackIndex = index;
        const trackToPlay = tracks[currentTrackIndex + 1];
        playTrack(trackToPlay.path);
    });
});

const nextButton = document.getElementById('nextIcon');
const prevButton = document.getElementById('prevIcon');
let currentTrackIndex = 0;

nextButton.addEventListener('click', playNextTrack);
prevButton.addEventListener('click', playPreviousTrack);

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % Object.keys(tracks).length;
    const nextTrackPath = tracks[currentTrackIndex + 1];
    playTrack(nextTrackPath.path);
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + Object.keys(tracks).length) % Object.keys(tracks).length;
    const previousTrackPath = tracks[currentTrackIndex + 1];
    playTrack(previousTrackPath.path);
}

const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const currentTimeDisplay = document.querySelector('.current-time');
const totalDurationDisplay = document.querySelector('.total-duration');

audioPlayer.addEventListener('timeupdate', updateProgressBar);

function updateProgressBar() {
    if (!isAudioLoaded) {
        return;
    }
    const currentTime = audioPlayer.currentTime;
    const currentTrack = tracks[currentTrackIndex + 1];
    if (currentTrack) {
        const duration = currentTrack.duration;
        const progressPercentage = (currentTime / convertTimeToSeconds(duration)) * 100;

        progressBar.style.width = `${progressPercentage}%`;
        currentTimeDisplay.textContent = formatTime(currentTime);
        totalDurationDisplay.textContent = duration;
        currentTrackName.textContent = currentTrack.name;
    }
}

function convertTimeToSeconds(time) {
    const timeParts = time.split(':');
    const minutes = parseInt(timeParts[0]);
    const seconds = parseInt(timeParts[1]);
    return minutes * 60 + seconds;
  }

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// scrubbing the progress bar feature
// Add these variables to keep track of scrubbing state and initial progress bar width
let isScrubbing = false;
let scrubStartX = 0;
let initialProgressBarWidth = progressBarContainer.getBoundingClientRect().width;

// Add new event listeners for scrubbing
progressBarContainer.addEventListener('mousedown', handleScrubStart);
window.addEventListener('mousemove', handleScrubMove);
window.addEventListener('mouseup', handleScrubEnd);

function handleScrubStart(event) {
    isScrubbing = true;
    scrubStartX = event.clientX;
    initialProgressBarWidth = progressBarContainer.getBoundingClientRect().width;
}

function handleScrubMove(event) {
    if (!isScrubbing) return;

    const offsetX = event.clientX - progressBarContainer.getBoundingClientRect().left;
    const scrubPercentage = Math.max(0, Math.min(1, offsetX / initialProgressBarWidth));

    const currentTrack = tracks[currentTrackIndex + 1];
    const duration = convertTimeToSeconds(currentTrack.duration);
    const seekTime = duration * scrubPercentage;

    progressBar.style.width = `${scrubPercentage * 100}%`;
    currentTimeDisplay.textContent = formatTime(seekTime);
}

function handleScrubEnd(event) {
    if (!isScrubbing) return;

    isScrubbing = false;

    const offsetX = event.clientX - progressBarContainer.getBoundingClientRect().left;
    const scrubPercentage = Math.max(0, Math.min(1, offsetX / initialProgressBarWidth));

    const currentTrack = tracks[currentTrackIndex + 1];
    const duration = convertTimeToSeconds(currentTrack.duration);
    const seekTime = duration * scrubPercentage;

    audioPlayer.currentTime = seekTime;
}

// volume controls
// Add this to set the default volume to 70%
audioPlayer.volume = 0.7;

const volumeIcon = document.querySelector('.volume-icon');
const volumeSliderContainer = document.querySelector('.volume-slider-container');
const volumeSlider = document.querySelector('.volume-slider');

let isVolumeDragging = false;

// Add event listeners for volume control
volumeIcon.addEventListener('mousedown', startVolumeDrag);
window.addEventListener('mousemove', handleVolumeDrag);
window.addEventListener('mouseup', endVolumeDrag);
volumeSliderContainer.addEventListener('mousedown', startVolumeDrag);
volumeSliderContainer.addEventListener('mousemove', handleVolumeDrag);
window.addEventListener('mouseup', endVolumeDrag);


function startVolumeDrag(event) {
    isVolumeDragging = true;
    adjustVolume(event.clientX);
}

function handleVolumeDrag(event) {
    if (!isVolumeDragging) return;
    event.stopPropagation();
    adjustVolume(event.clientX);
}

function endVolumeDrag() {
    isVolumeDragging = false;
}

function adjustVolume(mouseX) {
    const volumeSliderRect = volumeSliderContainer.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(volumeSliderRect.width, mouseX - volumeSliderRect.left));
    const volumePercentage = offsetX / volumeSliderRect.width;

    audioPlayer.volume = volumePercentage;
    volumeSlider.style.width = `${volumePercentage * 100}%`;
}
