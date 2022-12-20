

export const audioTypes = {
    "audio/ogg": [".ogg"],
    "audio/x-ogg": [".ogg"],
    "audio/wav": [".wav"],
    "audio/x-wav": [".wav"],
    "audio/wave": [".wav"],
    "audio/x-wave": [".wav"],
    "audio/webm": [".webm"],
    "audio/x-webm": [".webm"],
    "audio/mp4": [".mp4"],
    "audio/x-mp4": [".mp4"],
    "audio/mp4a": [".mp4"],
    "audio/x-mp4a": [".mp4"],
    "audio/m4a": [".m4a"],
    "audio/x-m4a": [".m4a"],
    "audio/mpeg": [".mpeg"],
    "audio/x-mpeg": [".mpeg"],
    "audio/mp3": [".mp3"],
    "audio/x-mp3": [".mp3"],
    "audio/mpeg3": [".mp3"],
    "audio/x-mpeg3": [".mp3"],
  };
  

export  const isAudioFile = (str) => Object.values(audioTypes).some(element => {
    if (str.toLowerCase().indexOf(element) !== -1) {
      return true;
    }

    return false;
  });