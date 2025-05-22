import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameScroll.module.css";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";

const CHUNK_SIZE = 106;
const PRELOAD_AHEAD = 106;
const INITIAL_FRAMES_TO_LOAD = 106;
const TEXT_UPDATE_THROTTLE = 100; // ms between text updates

const FrameScroll = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentText, setCurrentText] = useState("hello");
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(0);

  const totalFrames = 106;
  const canvasRef = useRef(null);
  const frameImagesRef = useRef({});
  const loadingChunksRef = useRef(new Set());
  const lastDrawnFrameRef = useRef(null);
  const lastTextUpdateTimeRef = useRef(0);

  // Refs for optimized scroll handling
  const currentTextRef = useRef(currentText);
  const isTextTransitioningRef = useRef(false);
  const tickingRef = useRef(false);
  const showVideoRef = useRef(showVideo);
  const isTransitioningRef = useRef(isTransitioning);
  const rafIdRef = useRef(null);

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

  // Keep refs updated with latest state values
  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    showVideoRef.current = showVideo;
  }, [showVideo]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Load frames chunk
  const loadFrameChunk = async (start, end) => {
    const key = `${start}-${end}`;
    if (loadingChunksRef.current.has(key)) return;
    loadingChunksRef.current.add(key);

    const promises = [];

    for (let i = start; i <= end && i <= totalFrames; i++) {
      if (!frameImagesRef.current[i]) {
        const frameNum = String(i).padStart(3, "0");
        const img = new Image();
        img.src = `/frames/frame_${frameNum}.webp`;

        const promise = img
          .decode()
          .then(() => {
            frameImagesRef.current[i] = img;
            setLoadedFrames((prev) => {
              const count = prev + 1;
              if (count >= INITIAL_FRAMES_TO_LOAD) setIsLoading(false);
              return count;
            });
          })
          .catch(() => {});
        promises.push(promise);
      }
    }

    await Promise.all(promises);
    loadingChunksRef.current.delete(key);
  };

  // Draw frame on canvas
  const drawFrame = (frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) return;

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

  // Initial chunk load
  useEffect(() => {
    const initialEnd = Math.min(CHUNK_SIZE, totalFrames);
    loadFrameChunk(1, initialEnd);
  }, []);

  // Preload all frames in background
  useEffect(() => {
    let cancelled = false;
    const preloadAll = async () => {
      for (let i = 1; i <= totalFrames && !cancelled; i++) {
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
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep max 100 frames cached
  useEffect(() => {
    const KEEP = 100;
    const keys = Object.keys(frameImagesRef.current).map(Number);
    if (keys.length > KEEP) {
      const sorted = keys.sort((a, b) => a - b);
      const toRemove = sorted.slice(0, keys.length - KEEP);
      for (let k of toRemove) delete frameImagesRef.current[k];
    }
  }, [currentFrame]);

  // Canvas sizing on mount
  useLayoutEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = 1280;
      canvasRef.current.height = 720;
      drawFrame(currentFrame);
    }
  }, []);

  // Handle window resize
  useLayoutEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = 1280;
        canvasRef.current.height = 720;
        drawFrame(currentFrame);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw frame after loading
  useEffect(() => {
    if (!isLoading) {
      drawFrame(currentFrame);
    }
  }, [isLoading]);

  // Optimized scroll handler
  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const winH = window.innerHeight;
        const docH = document.documentElement.scrollHeight;
        const percent = scrollY / (docH - winH);

        setScrollProgress(percent);

        // Calculate frame number
        const frameNum = Math.min(
          Math.max(1, Math.floor(percent * totalFrames) + 1),
          totalFrames
        );
        setCurrentFrame(frameNum);

        // Throttled text update
        const now = Date.now();
        if (now - lastTextUpdateTimeRef.current > TEXT_UPDATE_THROTTLE) {
          const textIndex = Math.min(
            Math.floor(percent * texts.length),
            texts.length - 1
          );
          const nextText = texts[textIndex];

          if (
            nextText !== currentTextRef.current &&
            !isTextTransitioningRef.current
          ) {
            isTextTransitioningRef.current = true;
            setCurrentText(nextText);
            setTimeout(() => {
              isTextTransitioningRef.current = false;
            }, 500);
          }
          lastTextUpdateTimeRef.current = now;
        }

        const preloadStart = Math.min(frameNum + 1, totalFrames);
        const preloadEnd = Math.min(frameNum + PRELOAD_AHEAD, totalFrames);
        loadFrameChunk(preloadStart, preloadEnd);

        // Video and transition logic with refs
        if (
          frameNum === totalFrames &&
          !showVideoRef.current &&
          !isTransitioningRef.current
        ) {
          setIsTransitioning(true);
          setTimeout(() => {
            setShowVideo(true);
            setTimeout(() => setIsTransitioning(false), 500);
          }, 500);
        } else if (
          frameNum < totalFrames &&
          showVideoRef.current &&
          !isTransitioningRef.current
        ) {
          setIsTransitioning(true);
          setTimeout(() => {
            setShowVideo(false);
            setTimeout(() => setIsTransitioning(false), 500);
          }, 500);
        }

        rafIdRef.current = null;
      });
    };

    // Use passive scroll listener for better performance
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Draw frame on currentFrame change
  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame]);

  // Calculate text vertical position for smooth upward motion
  const getTextPosition = () => {
    if (showVideo) return "translate(-50%, -2000%)";
    const offset = -scrollProgress * 80;
    return `translate(-50%, calc(-50% + ${offset}vh))`;
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
            <div className={styles.centeredText}>
              Умный дамах <br />
            </div>
          )}
        </div>

        <div
          className={styles.greeting}
          style={{ transform: getTextPosition() }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
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