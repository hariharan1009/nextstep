"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        !event.target.closest(`.${styles.profileContainer}`)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>NextStep</div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/#about">About</Link>
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
      <div className={styles.rightSection}>
        <Link href="/login" className={styles.loginLink}>
          LOGIN
        </Link>
        <div
          className={styles.profileContainer}
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <FaUserCircle size={30} className={styles.profileIcon} />
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <Link href="/dashboard">Dashboard</Link>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
