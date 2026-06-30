import { useEffect, useRef } from "react";

let currentAudio = null;

export const musicController = {
  toggle() {
    if (!currentAudio) return;

    if (currentAudio.paused) {
      currentAudio.play().catch(() => {});
    } else {
      currentAudio.pause();
    }
  },

  isPlaying() {
    return currentAudio ? !currentAudio.paused : false;
  },

  stop() {
    if (!currentAudio) return;
    currentAudio.pause();
    currentAudio.currentTime = 0;
  },
};

export default function usePageMusic(fileName, volume = 0.15) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!fileName) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(`${import.meta.env.BASE_URL}audio/${fileName}`);
    audio.loop = true;
    audio.volume = volume;

    currentAudio = audio;
    audioRef.current = audio;

    const playMusic = () => {
      audio.play().catch(() => {});
    };

    window.addEventListener("click", playMusic, { once: true });
    window.addEventListener("touchstart", playMusic, { once: true });
    window.addEventListener("keydown", playMusic, { once: true });

    return () => {
      audio.pause();
      audio.currentTime = 0;

      if (currentAudio === audio) {
        currentAudio = null;
      }

      window.removeEventListener("click", playMusic);
      window.removeEventListener("touchstart", playMusic);
      window.removeEventListener("keydown", playMusic);
    };
  }, [fileName, volume]);

  return audioRef;
}