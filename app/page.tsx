import Image from "next/image";
import styles from "./page.module.css";
import CTAChat from "./components/CTAChat/CTAChat";
import CTAButton from "./components/CTAButton/CTAButton";
import {
  FaRegLightbulb,
  FaUserGraduate,
  FaCogs,
  FaChartLine,
} from "react-icons/fa";

export default function Page() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.leftSection}>
          <h1>Your Future, One Step Ahead with AI</h1>
          <span>
            Transform your professional journey with personalized insights and
            career tracking. NextStep empowers you to bridge skill gaps, plan
            your growth, and stay ahead in an ever-evolving world.
          </span>
          <div className={styles.ctaSection}>
            <CTAButton />
            <CTAChat />
          </div>
        </div>

        <div className={styles.rightSection}>
          <Image
            src="/ai-career.png"
            alt="Hero Section Image"
            width={500}
            height={435}
          />
        </div>
      </div>

      <div id="about" className={styles.aboutSection}>
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
              <FaUserGraduate className={styles.icon} />
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
      </div>
    </>
  );
}
