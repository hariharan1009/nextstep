"use client";

import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.linksSection}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="#about">About</Link>
            </li>
            <li>
              <Link href="/chatbot">Chatbot</Link>
            </li>
            <li>
              <Link href="/resume-review">Resume Review</Link>
            </li>
            <li>
              <Link href="/career-path">Career Paths</Link>
            </li>
            <li>
              <Link href="/training-program">Training Program</Link>
            </li>
            <li>
              <Link href="/mock-interview">Mock Interview</Link>
            </li>
          </ul>
        </div>
        <div className={styles.socialLinks}>
          <Link
            href="https://github.com/aravinth-krishna/nextstep"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://linkedin.com/aravinth-krishna-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={24} />
          </Link>
          <Link
            href="https://instagram.com/_.d.a.z.z._"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://youtube.com/aravinthkrishna"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={24} />
          </Link>
          <Link href="mailto:r.aravinthkrishna@gmail.com">
            <FaEnvelope size={24} />
          </Link>
        </div>
      </div>
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} NextStep. All rights reserved.
      </div>
    </footer>
  );
}
