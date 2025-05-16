
import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [shouldRemove, setShouldRemove] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 200ms sonra fadeOut başlasın
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 200);

    // 5 saniye boyunca progress artışı
    const start = Date.now();
    const duration = 5000; // 5 saniye

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.min((elapsed / duration) * 100, 100);
      setProgress(percentage);
      if (percentage >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    // 5 saniye sonra loader kaldır
    const removeTimer = setTimeout(() => {
      setShouldRemove(true);
    }, duration + 500); // 500ms ekstra fade için

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearInterval(progressInterval);
    };
  }, []);

  if (shouldRemove) return null;

  return (
    <div
      className={`${styles.loaderContainer} ${isFading ? styles.fadeOut : ""}`}
    >
     
      <div className={styles.loadingText}>Sizigia</div>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
          aria-label="Loading"
        ></div>
      </div>
    </div>
  );
};

export default PageLoader;
