import React, { useEffect } from "react";

import PropTypes from "prop-types";
import WaveSurfer from "wavesurfer.js";

export const initializeWavesurfer = (container, url, options = {}) => {
  const wave = WaveSurfer.create({
    container: container,
    responsive: true,
    height: 128,
    normalize: true,
    backgroundColor: "hsla(0, 0%, 95%, 1)",
    waveColor: "rgba(0,0,0,1)",
    progressColor: "hsla(250, 99%, 40%, 1)",
    cursorColor: "rgba(0,0,0,.2)",
    ...options,
  });


  wave.load(url);

  return wave;
};

const InitAudioPlayer = (index, objectURL, autoplay, options) => {
  const playButton = document.querySelector(`#play-button-${index}`);
  const playButtonIcon = document.querySelector(`#play-button-icon-${index}`);
  const volumeIcon = document.querySelector(`#volume-icon-${index}`);
  const volumeSlider = document.querySelector(`#volume-slider-${index}`);
  const zoomSlider = document.querySelector(`#zoom-slider-${index}`);
  const currentTime = document.querySelector(`#current-time-${index}`);
  const totalDuration = document.querySelector(`#total-duration-${index}`);
  const progressBar = document.querySelector(`#progress-bar-${index}`);
  const spectrogram = document.querySelector(`#spectrogram-${index}`);
  const progressBarValue = document.querySelector(
    `#progress-bar-value-${index}`
  );

  const wavesurfer = initializeWavesurfer(
    `#waveform-${index}`,
    objectURL,
    options
  );

  const togglePlay = () => {
    wavesurfer.playPause();

    const isPlaying = wavesurfer.isPlaying();

    if (isPlaying) {
      playButtonIcon.src = "/images/icons/pause.svg";
    } else {
      playButtonIcon.src = "/images/icons/play.svg";
    }
  };

  const handleVolumeChange = (e) => {
    // Set volume as input value divided by 100
    // NB: Wavesurfer only excepts volume value between 0 - 1
    const volume = e.target.value / 100;
    wavesurfer.setVolume(volume);

    // Save the value to local storage so it persists between page reloads
    sessionStorage.setItem(`audio-player-volume-${index}`, volume);
  };

  const setValuesFromLocalStorage = () => {
    // Retrieves the volume from localstorage, or falls back to default value of 50
    const volume = sessionStorage.getItem(`audio-player-volume-${index}`) || .5;
    const zoom = sessionStorage.getItem(`zoom-player-value-${index}`) || .5;

    volumeSlider.value = volume;
    zoomSlider.value = zoom;
  };

  const formatTimecode = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  };

  const toggleMute = () => {
    wavesurfer.toggleMute();

    const isMuted = wavesurfer.getMute();

    if (isMuted) {
      volumeIcon.src = "/images/icons/mute.svg";
      volumeSlider.disabled = true;
    } else {
      volumeSlider.disabled = false;
      volumeIcon.src = "/images/icons/volume.svg";
    }
  };

  const toogleVolumeSlider = () => {
    if (Array.from(volumeSlider.classList).includes("volume-slider--visible")) {
      volumeSlider.classList.remove("volume-slider--visible");
    } else {
      volumeSlider.classList.add("volume-slider--visible");
    }
  };

  // Javascript Event listeners
  window.addEventListener("load", setValuesFromLocalStorage);

  playButton.addEventListener("click", togglePlay);
  volumeIcon.addEventListener("click", toggleMute);
  volumeIcon.addEventListener("mouseover", toogleVolumeSlider);
  volumeIcon.addEventListener("mouseleave", toogleVolumeSlider);
  volumeSlider.addEventListener("mouseover", toogleVolumeSlider);
  volumeSlider.addEventListener("mouseleave", toogleVolumeSlider);
  volumeSlider.addEventListener("input", handleVolumeChange);
  zoomSlider.addEventListener(
    "input",
    wavesurfer.util.debounce(function () {
      wavesurfer.zoom(this.value);
      sessionStorage.setItem(`zoom-player-value-${index}`, this.value);
    }, 100)
  );

  // Wavesurfer event listeners
  wavesurfer.on("ready", () => {
    if(autoplay) {
      wavesurfer.play();

    }
    // Set wavesurfer volume
    wavesurfer.setVolume(volumeSlider.value / 100);

    // Set audio track total duration
    const duration = wavesurfer.getDuration();
    totalDuration.innerHTML = formatTimecode(duration);
  });

  // Sets the timecode current timestamp as audio plays
  wavesurfer.on("audioprocess", () => {
    const time = wavesurfer.getCurrentTime();
    currentTime.innerHTML = formatTimecode(time);
    progressBarValue.style.width =
      (wavesurfer.getCurrentTime() / wavesurfer.getDuration()) * 100 + "%";
  });

  progressBar.addEventListener("click", function (e) {
    let bounds = this.getBoundingClientRect();
    let max = bounds.width; //Get width element
    let pos = e.pageX - bounds.left; //Position cursor
    let percent = Math.round((pos / max) * 100); // Round %
    let currentTime = (percent * wavesurfer.getDuration()) / 100;
    wavesurfer.play(currentTime);
  });

  // Resets the play button icon after audio ends
  wavesurfer.on("finish", () => {
    playButtonIcon.src = "/images/icons/play.svg";
  });
};

const AudioPlayer = ({ index, objectURL, autoplay }) => {
  useEffect(() => {
    InitAudioPlayer(index, objectURL, autoplay);
  }, [index, objectURL]);

  return (
    <div className={"audio-player"}>
      <div className="player-body">
        <div id={`waveform-${index}`} className="waveform"></div>
        <div className="controls">
          <button id={`play-button-${index}`} className="play-button">
            <img
              id={`play-button-icon-${index}`}
              className="play-button-icon"
              src={"/images/icons/play.svg"}
              alt="Play Button"
            />
          </button>
          <div className="timecode">
            <span id={`current-time-${index}`}>00:00:00</span>
            <span> / </span>
            <span id={`total-duration-${index}`}>00:00:00</span>
          </div>
          <div className="volume">
            <img
              id={`volume-icon-${index}`}
              className="volume-icon"
              src={"/images/icons/volume.svg"}
              alt="Volume"
            />
            <input
              id={`volume-slider-${index}`}
              className="volume-slider"
              type="range"
              name="volume-slider"
              min="0"
              max="100"
            />
          </div>
          <div className="zoom">
            <img
              id={`zoom-icon-${index}`}
              className="zoom-icon"
              src={"/images/icons/zoom.svg"}
              alt="Zoom"
            />
            <input
              id={`zoom-slider-${index}`}
              className="zoom-slider"
              type="range"
              min="1"
              max="200"
            />
          </div>
        </div>
        <div className="controls controls--progress-bar">
          <div id={`progress-bar-${index}`} className="progress-bar">
            <div
              id={`progress-bar-value-${index}`}
              className="progress-bar-value"
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

AudioPlayer.defaultProps = {
  index: 0,
};

AudioPlayer.propTypes = {
  index: PropTypes.oneOfType([
    PropTypes.number.isRequired,
    PropTypes.string.isRequired,
  ]),
  objectURL: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
  ]),
  autoplay: PropTypes.bool
};

InitAudioPlayer.propTypes = {
  objectURL: PropTypes.string.isRequired,
  options: PropTypes.shape({
    backgroundColor: PropTypes.string,
    waveColor: PropTypes.string,
    progressColor: PropTypes.string,
    cursorColor: PropTypes.string,
  }),
};
