"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./TrainingProgram.module.css";

interface ProgramState {
  videos: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  book: {
    title: string;
    description: string;
  };
}

const RecommendationComponent = () => {
  const [skill, setSkill] = useState<string>("");
  const [program, setProgram] = useState<ProgramState | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSearch = async () => {
    const res = await fetch(`/api/recommend?skill=${skill}`);
    const data = await res.json();
    if (data.videos && data.book) {
      setProgram({ videos: data.videos, book: data.book });
      setShowFullDescription(false); // Reset show/hide state on new search
    } else {
      setProgram(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getBulletPoints = (description: string) => {
    if (!description) return [];
    const points = description
      .split(".")
      .map((point) => point.trim())
      .filter((point) => point.length > 0);

    return showFullDescription ? points : points.slice(0, 3);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Training Program Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.input}
          placeholder="Enter a skill..."
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>

      {program && (
        <div className={styles.contentWrapper}>
          {/* Video Section */}
          <div className={styles.videoSection}>
            <h2 className={styles.h2}>Video Content</h2>
            <ul className={styles.ul}>
              {program.videos.map((video, index) => (
                <li key={index} className={styles.li}>
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.a}
                  >
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      width={120}
                      height={90}
                      className={styles.img}
                    />
                    <p className={styles.p}>{video.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Book Section */}
          <div className={styles.bookSection}>
            <h2 className={styles.h2}>Book Content</h2>
            <h3 className={styles.bookTitle}>{program.book.title}</h3>
            <ul className={styles.bulletPoints}>
              {getBulletPoints(program.book.description).map((point, index) => (
                <li key={index} className={styles.bulletPoint}>
                  {point}.
                </li>
              ))}
            </ul>
            {program.book.description.split(".").filter((p) => p.trim())
              .length > 8 && (
              <button
                className={styles.readMore}
                onClick={() => setShowFullDescription((prev) => !prev)}
              >
                {showFullDescription ? "Show Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationComponent;
