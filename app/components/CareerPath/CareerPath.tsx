"use client";

import React, { useState } from "react";
import Groq from "groq-sdk";
import styles from "./CareerPath.module.css";

export default function CareerPath() {
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [domain, setDomain] = useState("");
  const [careerStages, setCareerStages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchCareerPath() {
    if (!domain) return;

    setLoading(true);
    const userMessage = `Generate a six-stage career path for a professional in ${domain}. Respond with only six stages of the career, separated by commas.`;
    const response = await getGroqChatCompletion(userMessage);
    const rawStages = response.choices[0]?.message?.content || "";
    const stagesArray = rawStages.split(",").map((stage) => stage.trim());
    setCareerStages(stagesArray);
    setLoading(false);
  }

  async function getGroqChatCompletion(userMessage: string) {
    return groq.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "llama-3.3-70b-versatile",
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Career Path Generator</h1>
      <p className={styles.description}>
        Enter a career domain to generate a six-stage professional career path.
      </p>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter a career domain (e.g., AI, Marketing)"
        className={styles.input}
      />
      <button
        onClick={fetchCareerPath}
        className={`${styles.button} ${loading && styles.disabledButton}`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Career Path"}
      </button>
      {careerStages.length > 0 && (
        <div className={styles.flowchart}>
          {careerStages.map((stage, index) => (
            <div key={index} className={styles.box}>
              {stage}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
