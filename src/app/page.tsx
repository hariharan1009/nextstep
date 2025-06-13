// app/page.tsx
'use client'; // Required for animations and interactivity

import Image from 'next/image';
import { FaRegLightbulb, FaCogs, FaChartLine, FaUserTie } from 'react-icons/fa';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.leftSection}>
          <h1>Your Future, One Step Ahead with AI</h1>
          <span>
            Transform your professional journey with personalized insights and
            career tracking. NextStep empowers you to bridge skill gaps, plan
            your growth, and stay ahead in an ever-evolving world.
          </span>
          <div className={styles.ctaSection}>
            <button className={styles.primaryButton}>Get Started →</button>
            <button className={styles.secondaryButton}>Chat with AI</button>
          </div>
        </div>
        <div className={styles.rightSection}>
          <Image
            src="/ai-career.png"
            alt="AI Career Guidance"
            width={500}
            height={435}
            priority
          />
        </div>
      </section>

      <section id="about" className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>Why Choose NextStep?</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.point}>
            <div className={styles.iconContainer}>
              <FaRegLightbulb className={styles.icon} />
            </div>
            <h3>Personalized Career Paths</h3>
            <p>
              Our AI-powered platform analyzes your goals and provides
              step-by-step guidance tailored to your aspirations.
            </p>
          </div>
          <div className={styles.point}>
            <div className={styles.iconContainer}>
              <FaUserTie className={styles.icon} />
            </div>
            <h3>Skill Development</h3>
            <p>
              Discover the tools and resources to close skill gaps and unlock
              your true potential with curated recommendations.
            </p>
          </div>
          <div className={styles.point}>
            <div className={styles.iconContainer}>
              <FaCogs className={styles.icon} />
            </div>
            <h3>Real-Time Feedback</h3>
            <p>
              Get actionable insights and feedback instantly to stay on the
              right path toward achieving your milestones.
            </p>
          </div>
          <div className={styles.point}>
            <div className={styles.iconContainer}>
              <FaChartLine className={styles.icon} />
            </div>
            <h3>Comprehensive Tracking</h3>
            <p>
              Visualize your progress, celebrate achievements, and adapt to
              challenges with robust career tracking tools.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}