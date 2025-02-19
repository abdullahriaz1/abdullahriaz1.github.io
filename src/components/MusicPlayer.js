import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import "./MusicPlayer.css";

// Example JSON data for songs.
// You could also import this from an external JSON file.
const songsData = [
  {
    file: "IV. Allegro Volto.mp3",
    songName: "String Quartet No.19 In C Major, K 465, Dissonance - IV. Allegro Volto",
    artist: "Wolfgang Amadeus Mozart"
  },
  {
    file: "IV. Double Presto.mp3",
    songName: "Partita for Violin Solo No. 1 in B Minor, BWV 1002 - 4. Double (Presto).",
    artist: "Johann Sebastian Bach"
  },
  {
    file: "Lyric Pieces, Op. 12 - I. Arietta.mp3",
    songName: "Lyric Pieces Book I, Op.12 - 1. Arietta",
    artist: "Edvard Grieg"
  },
  {
    file: "Variations Brillantes, Op. 12.mp3",
    songName: "Variations Brillantes, Op. 12",
    artist: "Frédéric Chopin"
  },
  {
    file: "Violin Concerto no. 1 in E flat major, Op. 6 -  I. Allegro maestoso.mp3",
    songName: "Violin Concerto no. 1 in E flat major, Op. 6 - I. Allegro maestoso",
    artist: "Niccolò Paganini"
  }
];

/* ========= Utility Functions ========= */

// Format time (in seconds) to mm:ss
function formatTime(time) {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Strip hash from file name (if present) and remove a trailing ".mp3" (case-insensitive)
const getCleanFileName = (file) => {
  let fileName = file;
  const parts = fileName.split(".");
  if (parts.length >= 3) {
    const potentialHash = parts[parts.length - 2];
    if (/^[a-f0-9]+$/i.test(potentialHash)) {
      parts.splice(parts.length - 2, 1);
      fileName = parts.join(".");
    }
  }
  // Remove a trailing .mp3 extension (case-insensitive)
  fileName = fileName.replace(/\.mp3$/i, "");
  return fileName;
};

// Utility function to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ========= 3D Components ========= */

// A rotating cube that maps the album image as its texture.
// Now only rotates on the horizontal (Y) axis.
function RotatingAlbumCube({ imgPath }) {
  const texture = useLoader(TextureLoader, imgPath);
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Full-screen animated background canvas (updated to remove the torus)
function CoolBackground() {
  return (
    <Canvas
      className="background-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: "#121212",
      }}
      camera={{ position: [0, 0, 10] }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
    </Canvas>
  );
}

// A subtle rotating cube for the playlist sidebar background
function RotatingCube() {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial
        color="#282828"
        wireframe
        opacity={0.2}
        transparent
      />
    </mesh>
  );
}

// Canvas for the playlist background
function PlaylistBackground() {
  return (
    <Canvas
      className="playlist-background-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      camera={{ position: [0, 0, 10] }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <RotatingCube />
    </Canvas>
  );
}

/* ========= Main MusicPlayer Component ========= */

function MusicPlayer() {
  // Fallback album art in case no random image is available.
  const defaultImgPath = "/IMG_4649.jpeg";

  // Instead of loading songs via require.context, we now use our JSON data.
  const [songs, setSongs] = useState(songsData);
  const [songAlbumArts, setSongAlbumArts] = useState([]);
  const [albumArts, setAlbumArts] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);

  // Load album art images from your album art folder ("../photo-gallery/")
  useEffect(() => {
    const importAll = (r) => r.keys().map(r);
    const arts = importAll(
      require.context("../photo-gallery/", false, /\.(png|jpe?g|svg)$/)
    );
    setAlbumArts(arts);
  }, []);

  // Once songs and albumArts are loaded, assign each song a random album art without repeats.
  useEffect(() => {
    if (songs.length > 0 && albumArts.length > 0) {
      const assignedArts = [];
      let availableArts = shuffleArray(albumArts);
      
      for (let i = 0; i < songs.length; i++) {
        // If we've used all available arts, reshuffle the albumArts array.
        if (availableArts.length === 0) {
          availableArts = shuffleArray(albumArts);
        }
        // Pop one from the available arts
        assignedArts.push(availableArts.pop());
      }
      setSongAlbumArts(assignedArts);
    }
  }, [songs, albumArts]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pauseSong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) => {
      if (isShuffle && songs.length > 1) {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === prevIndex);
        return nextIndex;
      } else {
        return (prevIndex + 1) % songs.length;
      }
    });
    setCurrentTime(0);
    if (!isPlaying) {
      playSong();
    }
  }, [songs, isShuffle, isPlaying, playSong]);

  const prevSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
    setCurrentTime(0);
  }, [songs]);

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleSeek = useCallback((e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    nextSong();
  }, [nextSong]);

  // Keyboard shortcuts: ArrowRight for next, ArrowLeft for previous, Space for play/pause.
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowRight":
          nextSong();
          break;
        case "ArrowLeft":
          prevSong();
          break;
        case "Space":
          e.preventDefault();
          isPlaying ? pauseSong() : playSong();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSong, prevSong, playSong, pauseSong, isPlaying]);

  // Automatically play the song when songs are loaded (i.e. on component mount)
  useEffect(() => {
    if (songs.length > 0) {
      playSong();
    }
  }, [songs, playSong]);

  useEffect(() => {
    if (isPlaying) {
      playSong();
    }
  }, [currentSongIndex, isPlaying, playSong]);

  const progressPercent =
    audioRef.current && audioRef.current.duration
      ? (currentTime / audioRef.current.duration) * 100
      : 0;

  // Use the assigned random album art for the current song or fallback to default.
  const currentAlbumArt =
    songAlbumArts[currentSongIndex] || defaultImgPath;

  // Build the full path for the song file (assuming your songs are stored in "../../public/songs/")
  const getSongSrc = (songFile) => `/songs/${songFile}`;

  return (
    <div className="music-player-container">
      {/* Full-screen animated background */}
      <CoolBackground />

      <motion.div
        className="music-player-inner"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="music-player-grid">
          {/* Now Playing Panel */}
          <div className="now-playing-panel">
            <Canvas
              style={{ width: "256px", height: "256px" }}
              camera={{ position: [0, 0, 3] }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 0, 5]} intensity={1} />
              <RotatingAlbumCube imgPath={currentAlbumArt} />
            </Canvas>
            <div className="song-info">
              <h2>{songs[currentSongIndex]?.songName}</h2>
              <p>{songs[currentSongIndex]?.artist}</p>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-wrapper">
                <input
                  type="range"
                  min="0"
                  max={audioRef.current?.duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="progress-range"
                />
                <motion.div
                  className="progress-bar"
                  style={{ width: `${progressPercent}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="time-display">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {audioRef.current?.duration
                    ? formatTime(audioRef.current.duration)
                    : "0:00"}
                </span>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="playlist-sidebar" style={{ position: "relative" }}>
            <h3>Playlist</h3>
            <PlaylistBackground />
            <div className="playlist-items">
              {songs.map((song, index) => (
                <motion.div
                  key={index}
                  onClick={() => {
                    setCurrentSongIndex(index);
                    playSong();
                  }}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  className={`playlist-item ${
                    index === currentSongIndex ? "active" : ""
                  }`}
                >
                  <div
                    className="playlist-album-art"
                    style={{ width: "48px", height: "48px", flexShrink: 0 }}
                  >
                    <img
                      src={songAlbumArts[index] || defaultImgPath}
                      alt="Album"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="playlist-song-info">
                    <p>{getCleanFileName(song.file)}</p>
                    <p className="artist">{song.artist}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Container */}
        <div className="controls-container" style={{ position: "relative" }}>
          <div className="center-controls">
            <motion.button
              onClick={toggleShuffle}
              className={`control-button shuffle-button ${
                isShuffle ? "active" : ""
              }`}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              style={{ width: "64px", height: "64px" }}
            >
              <span className="material-icons">shuffle</span>
            </motion.button>
            <motion.button
              onClick={prevSong}
              className="control-button prev-button"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              style={{ width: "64px", height: "64px" }}
            >
              <span className="material-icons">skip_previous</span>
            </motion.button>
            {isPlaying ? (
              <motion.button
                onClick={pauseSong}
                className="control-button play-pause-button"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                style={{ width: "64px", height: "64px" }}
              >
                <span className="material-icons">pause</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={playSong}
                className="control-button play-pause-button"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                style={{ width: "64px", height: "64px" }}
              >
                <span className="material-icons">play_arrow</span>
              </motion.button>
            )}
            <motion.button
              onClick={nextSong}
              className="control-button next-button"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              style={{ width: "64px", height: "64px" }}
            >
              <span className="material-icons">skip_next</span>
            </motion.button>
            <div className="volume-control">
              <span className="material-icons volume-icon">volume_down</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-range"
              />
              <span className="material-icons volume-icon">volume_up</span>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={getSongSrc(songs[currentSongIndex]?.file)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </motion.div>
    </div>
  );
}

export default MusicPlayer;
