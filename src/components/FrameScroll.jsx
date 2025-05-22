import React, { useEffect, useRef, useState } from "react";
import styles from "./FrameScroll.module.css";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";

const TOTAL_FRAMES = 106;
const CHUNK_SIZE = 106;
const PRELOAD_AHEAD = 106;

const texts = ["hello", "this", "is", "a", "website", "that", "works", "with", "scroll", "animation"];

const FrameScroll = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const frameImagesRef = useRef({});
  const lastDrawnFrameRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const animationFrameRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [currentText, setCurrentText] = useState(texts[0]);

  const loadFrame = (i) => {
    const padded = String(i).padStart(3, "0");
    const img = new Image();
    img.src = `/frames/frame_${padded}.webp`;
    return img.decode().then(() => {
      frameImagesRef.current[i] = img;
    });
  };

  const preloadInitialFrames = async () => {
    const promises = [];
    for (let i = 1; i <= CHUNK_SIZE; i++) {
      promises.push(
        loadFrame(i).catch(() => {})
      );
    }
    await Promise.all(promises);
    setIsLoading(false);
  };

  const drawFrame = (frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img =
      frameImagesRef.current[frameNumber] ||
      frameImagesRef.current[lastDrawnFrameRef.current];

    if (img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnFrameRef.current = frameNumber;
    }
  };

  const onScroll = () => {
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const percent = scrollY / (docH - winH);

      scrollProgressRef.current = percent;

      const frameNum = Math.min(Math.floor(percent * TOTAL_FRAMES) + 1, TOTAL_FRAMES);
      drawFrame(frameNum);

      const preloadStart = frameNum + 1;
      const preloadEnd = Math.min(frameNum + PRELOAD_AHEAD, TOTAL_FRAMES);
      for (let i = preloadStart; i <= preloadEnd; i++) {
        if (!frameImagesRef.current[i]) {
          loadFrame(i).catch(() => {});
        }
      }

      // Text sync
      const textIndex = Math.min(Math.floor(percent * texts.length), texts.length - 1);
      setCurrentText(texts[textIndex]);

      // Show video
      if (frameNum === TOTAL_FRAMES && !showVideo) {
        setShowVideo(true);
      } else if (frameNum < TOTAL_FRAMES && showVideo) {
        setShowVideo(false);
      }
    });
  };

  useEffect(() => {
    preloadInitialFrames();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1280;
      canvas.height = 720;
    }
  }, []);

  return (
    <>
      {isLoading && <PageLoader />}
      <div className={styles.container}>
        <div className={`${styles.frameContainer}`}>
          <canvas
            ref={canvasRef}
            className={`${styles.frame} ${showVideo ? styles.fadeOut : ""}`}
          />
          <video
            className={`${styles.video} ${showVideo ? styles.fadeIn : ""}`}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>

          {showVideo && (
            <div className={styles.centeredText}>Умный дамах <br /></div>
          )}
        </div>

        <div
          className={styles.greeting}
          style={{
            transform: `translateY(${-(scrollProgressRef.current * 80)}vh)`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <div className={styles.text}>{currentText}</div>
        </div>

        <div
          className={`${styles.scrollIndicator} ${!showVideo ? styles.show : ""}`}
          onClick={() => navigate("/about")}
        >
          <span className={styles.scrollText}>узнать больше</span>
          <svg
            className={styles.scrollArrow}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 5L12 19M12 19L5 12M12 19L19 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          className={`${styles.videoButton} ${showVideo ? styles.show : ""}`}
          onClick={() => navigate("/about")}
        >
          <span className={styles.buttonText}>узнать больше</span>
        </div>

        <div
          style={{
            minHeight: "100vh",
            marginTop: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    </>
  );
};

export default FrameScroll;
