"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>NextStep</div>

      {/* Hamburger Menu Button */}
      <button 
        className={styles.menuButton} 
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {isMenuOpen ? (
          <span className={styles.closeIcon}>✕</span>
        ) : (
          <span className={styles.hamburgerIcon}>☰</span>
        )}
      </button>

      {/* Navigation Links Container */}
      <div className={`${styles.navContainer} ${isMenuOpen ? styles.active : ""}`}>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link href="/#about" onClick={closeMenu}>About</Link>
          </li>
          <li>
            <Link href="/chatbot" onClick={closeMenu}>Chatbot</Link>
          </li>
          <li>
            <Link href="/resume" onClick={closeMenu}>Resume Review</Link>
          </li>
          <li>
            <Link href="/careepaths" onClick={closeMenu}>Career Paths</Link>
          </li>
          <li>
            <Link href="/training-program" onClick={closeMenu}>Training Program</Link>
          </li>
           <li>
            <Link href="/career-comparison" onClick={closeMenu}>Career Comparison</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}