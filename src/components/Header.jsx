import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsTransitioning(isAboutPage);
  }, [isAboutPage]);

  // Dışarı tıklanınca menüyü kapatmak için useEffect eklendi
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(`.${styles.nav}`) &&
        !e.target.closest(`.${styles.hamburger}`)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className={`${styles.header} ${isTransitioning ? styles.blackText : ''}`}>
      <div className={styles.logo}>
        <Link to="/" className={isAboutPage ? styles.blackText : ''}>
          Sizigia
        </Link>
      </div>

      <button
        className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link
          to="/about"
          className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          О нас
        </Link>
        <Link
          to="/gallery"
          className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Галерия
        </Link>
        <Link
          to="/contact"
          className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Контакт
        </Link>
      </nav>
    </header>
  );
};

export default Header;
