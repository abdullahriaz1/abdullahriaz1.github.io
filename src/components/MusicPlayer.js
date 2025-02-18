import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import "./MusicPlayer.css";

/* ========= Utility Functions ========= */

// Format time (in seconds) to mm:ss
function formatTime(time) {
  const minutes = Math.floor(time / 60) || 0;
  const seconds = Math.floor(time % 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Strip hash from file name
const getCleanFileName = (path) => {
  let fileName = path.split("/").pop();
  const parts = fileName.split(".");
  if (parts.length >= 3) {
    const potentialHash = parts[parts.length - 2];
    if (/^[a-f0-9]+$/i.test(potentialHash)) {
      parts.splice(parts.length - 2, 1);
      fileName = parts.join(".");
    }
  }
  return fileName;
};

/* ========= 3D Components ========= */

// A rotating cube that maps the album image as its texture
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

// Removed RotatingTorus component

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
      {/* RotatingTorus removed */}
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
  const defaultImgPath = "/IMG_4649.jpeg"; // Your album art image path

  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef(null);

  // Load songs from the public/songs folder
  useEffect(() => {
    const importAll = (r) => r.keys().map(r);
    const songFiles = importAll(
      require.context("../../public/songs/", false, /\.(mp3|wav|ogg|flac|aac|m4a)$/)
    );
    setSongs(songFiles);
  }, []);

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

  useEffect(() => {
    if (isPlaying) {
      playSong();
    }
  }, [currentSongIndex, isPlaying, playSong]);

  const progressPercent =
    audioRef.current && audioRef.current.duration
      ? (currentTime / audioRef.current.duration) * 100
      : 0;

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
              <RotatingAlbumCube imgPath={defaultImgPath} />
            </Canvas>
            <div className="song-info">
              <h2>
                {songs[currentSongIndex] &&
                  getCleanFileName(songs[currentSongIndex])}
              </h2>
              <p>Artist Name</p>
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
                      src={defaultImgPath}
                      alt="Album"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="playlist-song-info">
                    <p>{getCleanFileName(song)}</p>
                    <p className="artist">Artist Name</p>
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
          src={songs[currentSongIndex]}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </motion.div>
    </div>
  );
}

export default MusicPlayer;

