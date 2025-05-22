import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

const PageLoader = ({ isLoading, onFinish }) => {
  const [shouldRemove, setShouldRemove] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 2000);

      const start = Date.now();
      const duration = 5000;

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percentage = Math.min((elapsed / duration) * 100, 100);
        setProgress(percentage);
        if (percentage >= 100) {
          clearInterval(progressInterval);
          setShouldRemove(true);
          if (onFinish) onFinish();
        }
      }, 50);

      return () => {
        clearTimeout(fadeTimer);
        clearInterval(progressInterval);
      };
    }
  }, [isLoading, onFinish]);

  if (shouldRemove) return null;

  return (
    <div className={`${styles.loaderContainer} ${isFading ? styles.fadeOut : ""}`}>
      <div className={styles.loadingText}>Sizigia</div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} aria-label="Loading"></div>
      </div>
    </div>
  );
};

export default PageLoader;
