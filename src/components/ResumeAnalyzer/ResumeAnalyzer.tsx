"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
// import * as pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Groq from "groq-sdk";
import styles from "./ResumeAnalyzer.module.css";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export default function ResumeAnalyzer() {
  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const [resumeText, setResumeText] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Dynamically import PDF.js
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      try {
        const pdfData = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
          extractedText += pageText + " ";
        }

        setResumeText(extractedText.trim());
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    };
  };


  async function analyzeResume() {
    if (!resumeText || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    const userMessage = `Analyze the following resume:\n\n${resumeText}\n\nBased on this job description:\n\n${jobDescription}\n\nIdentify skill gaps and suggest improvements.`;

    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Analyze the resume and identify skill gaps. Tell missing skills/trainings/experiences... which might be required for the given job description. keep responses medium length and professional. don't use any markdown format.",
          },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const aiResponse =
        response.choices[0]?.message?.content || "No response received.";
      setAnalysis(aiResponse);
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAnalysis("An error occurred while analyzing the resume.");
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1>Resume Analyzer & Skill Gap Detector</h1>

      <div className={styles.uploadSection}>
        <input
          type="file"
          accept="application/pdf"
          placeholder="Upload your resume"
          onChange={handleFileUpload}
        />
      </div>

      <textarea
        className={styles.textArea}
        value={resumeText}
        rows={8}
        placeholder="Extracted resume text will appear here..."
        readOnly
      />

      <textarea
        className={styles.textArea}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={5}
        placeholder="Enter desired Job's description here..."
      />

      <button
        className={styles.button}
        onClick={analyzeResume}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <div className={styles.analysisSection}>
          <h2>Analysis & Skill Gaps</h2>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
}
