import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameScroll.module.css";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";

const CHUNK_SIZE = 106;
const PRELOAD_AHEAD = 106;
const INITIAL_FRAMES_TO_LOAD = 106;

const FrameScroll = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentText, setCurrentText] = useState("hello");
  const [loadedFrames, setLoadedFrames] = useState(0);

  const totalFrames = 106;
  const canvasRef = useRef(null);
  const frameImagesRef = useRef({});
  const lastDrawnFrameRef = useRef(null);
  const tickingRef = useRef(false);
  const isTextTransitioningRef = useRef(false);
  const showVideoRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const texts = [
    "hello",
    "this",
    "is",
    "a",
    "website",
    "that",
    "works",
    "with",
    "scroll",
    "animation",
  ];

  useEffect(() => {
    showVideoRef.current = showVideo;
  }, [showVideo]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1280;
      canvas.height = 720;
    }
  }, []);

  const loadFrameChunk = async (start, end) => {
    for (let i = start; i <= end && i <= totalFrames; i++) {
      if (!frameImagesRef.current[i]) {
        const frameNum = String(i).padStart(3, "0");
        const img = new Image();
        img.src = `/frames/frame_${frameNum}.webp`;
        try {
          await img.decode();
          frameImagesRef.current[i] = img;
          setLoadedFrames((prev) => {
            const next = prev + 1;
            if (next >= INITIAL_FRAMES_TO_LOAD) setIsLoading(false);
            return next;
          });
        } catch {}
      }
    }
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

  useEffect(() => {
    loadFrameChunk(1, CHUNK_SIZE);
  }, []);

  useEffect(() => {
    const preloadAll = async () => {
      for (let i = 1; i <= totalFrames; i++) {
        if (!frameImagesRef.current[i]) {
          const frameNum = String(i).padStart(3, "0");
          const img = new Image();
          img.src = `/frames/frame_${frameNum}.webp`;
          try {
            await img.decode();
            frameImagesRef.current[i] = img;
          } catch {}
        }
        await new Promise((r) => setTimeout(r, 10));
      }
    };
    preloadAll();
  }, []);

  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame]);

  useEffect(() => {
    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const winH = window.innerHeight;
          const docH = document.documentElement.scrollHeight;
          const percent = scrollY / (docH - winH);

          const frameNum = Math.min(
            Math.max(1, Math.floor(percent * totalFrames) + 1),
            totalFrames
          );
          setCurrentFrame(frameNum);
          drawFrame(frameNum);

          const textIndex = Math.min(
            Math.floor(percent * texts.length),
            texts.length - 1
          );
          const nextText = texts[textIndex];
          if (nextText !== currentText && !isTextTransitioningRef.current) {
            isTextTransitioningRef.current = true;
            setCurrentText(nextText);
            setTimeout(() => {
              isTextTransitioningRef.current = false;
            }, 100);
          }

          if (
            frameNum === totalFrames &&
            !showVideoRef.current &&
            !isTransitioningRef.current
          ) {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowVideo(true);
              setTimeout(() => setIsTransitioning(false), 300);
            }, 300);
          } else if (
            frameNum < totalFrames &&
            showVideoRef.current &&
            !isTransitioningRef.current
          ) {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowVideo(false);
              setTimeout(() => setIsTransitioning(false), 300);
            }, 300);
          }

          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentText]);

  const getTextPosition = () => {
    return showVideo
      ? "translate3d(-50%, -2000%, 0)"
      : "translate3d(-50%, -50%, 0)";
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className={styles.container}>
        <div
          className={`${styles.frameContainer} ${
            isTransitioning ? styles.transitioning : ""
          }`}
        >
          <canvas
            ref={canvasRef}
            className={`${styles.frame} ${
              showVideo || isTransitioning ? styles.fadeOut : ""
            }`}
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
            <div className={styles.centeredText}>Умный дамах</div>
          )}
        </div>

        <div
          className={styles.greeting}
          style={{
            transform: getTextPosition(),
            willChange: "transform",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.08 }}
              className={styles.text}
            >
              {currentText}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={`${styles.scrollIndicator} ${
            !showVideo ? styles.show : ""
          }`}
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
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
          style={{ cursor: "pointer" }}
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
