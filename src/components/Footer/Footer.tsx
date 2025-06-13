"use client";

import React from "react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube, 
  FaEnvelope 
} from "react-icons/fa";
import Link from "next/link";
import styles from "./Footer.module.css";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks: SocialLink[] = [
    {
      icon: <FaGithub size={24} />,
      href: "https://github.com/",
      label: "GitHub"
    },
    {
      icon: <FaLinkedin size={24} />,
      href: "https://linkedin.com/in/",
      label: "LinkedIn"
    },
    {
      icon: <FaInstagram size={24} />,
      href: "https://instagram.com/",
      label: "Instagram"
    },
    {
      icon: <FaYoutube size={24} />,
      href: "https://youtube.com/",
      label: "YouTube"
    },
    {
      icon: <FaEnvelope size={24} />,
      href: "mailto:mdhari707@example.com",
      label: "Email"
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.linksSection}>
          {/* Navigation links can be added here */}
        </div>
        
        <div className={styles.socialLinks}>
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className={styles.socialLink}
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
      
      <div className={styles.copyright}>
        &copy; {currentYear} NextStep. All rights reserved.
      </div>
    </footer>
  );
}