"use client";

import React, { useState } from "react";
import Groq from "groq-sdk";
import styles from "./CareerComparison.module.css";

export default function CareerComparison() {
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [career1, setCareer1] = useState("");
  const [career2, setCareer2] = useState("");
  const [comparisonResult, setComparisonResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!career1.trim() || !career2.trim()) {
      setError("Please enter both careers");
      return;
    }

    setIsLoading(true);
    setError("");
    setComparisonResult("");

    try {
      const userMessage = `Compare and contrast these two careers: ${career1} and ${career2}. 
      Provide a detailed comparison including:
      1. Typical career progression stages
      2. Required education and skills
      3. Salary ranges at different levels
      4. Job market outlook
      5. Work-life balance considerations
      6. Future growth potential
      AVOID THE MARKDOWN SYNTAX AND USE PLAIN TEXT.
      DO NOT BOLD ANY TEXT AND **.
      Format the response in clear sections with bullet points.`;
      
const response = await groq.chat.completions.create({
  messages: [{ role: "user", content: userMessage }],
  model: "llama3-8b-8192",
  temperature: 0.7,
});

const result = response.choices?.[0]?.message?.content || "";

const cleanResult = result
  .replace(/\*\*/g, '') // Remove bold markers
  .replace(/^\s*-\s*/gm, '• ') // Convert markdown bullets to styled bullets
  .replace(/^#+\s*(.*)/gm, '<strong>$1</strong>'); // Convert headers to bold

setComparisonResult(cleanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Career Comparison Tool</h1>
      <p className={styles.subtitle}>
        Get intelligent comparisons between any two careers
      </p>

      <form onSubmit={handleCompare} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={career1}
            onChange={(e) => setCareer1(e.target.value)}
            placeholder="Enter first career (e.g. Software Engineer)"
            className={styles.input}
          />
          <span className={styles.vs}>vs</span>
          <input
            type="text"
            value={career2}
            onChange={(e) => setCareer2(e.target.value)}
            placeholder="Enter second career (e.g. Data Scientist)"
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${isLoading ? styles.disabledButton : ""}`}
        >
          {isLoading ? "Comparing..." : "Compare Careers"}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.result}>
        {isLoading ? (
          <div className={styles.loading}>
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        ) : (
          comparisonResult && (
            <div className={styles.resultText}>
              <h2 className={styles.resultTitle}>
                Comparison: {career1} vs {career2}
              </h2>
              <div
                className={styles.markdownContent}
                dangerouslySetInnerHTML={{
                  __html: comparisonResult.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}