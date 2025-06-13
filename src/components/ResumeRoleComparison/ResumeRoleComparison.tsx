"use client";

import React, { useState, useEffect } from "react";
import styles from "./ResumeRoleComparison.module.css"; // Assuming you have this CSS module

export default function PDFBookFinder() {
  const [bookDetails, setBookDetails] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [groqClient, setGroqClient] = useState<any>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null); // To store the pdfjs-dist library instance

  useEffect(() => {
    const initializeLibraries = async () => {
      // Ensure this code runs only in the browser environment
      if (typeof window !== 'undefined') {
        try {
          // Dynamically import pdfjs-dist
          // This ensures the library is loaded on the client-side
          const pdfjs = await import('pdfjs-dist');
          setPdfjsLib(pdfjs); // Store the imported pdfjs object in state

          // *** IMPORTANT: Set the worker source to the NEW Cloudflare CDN URL ***
          // Using version 4.10.38 as per your latest link.
          pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

          // Dynamically import Groq SDK
          const Groq = (await import('groq-sdk')).default;
          setGroqClient(new Groq({
            apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            dangerouslyAllowBrowser: true, // Be cautious with this in production; typically API calls should be server-side
          }));

        } catch (err) {
          console.error("Failed to initialize libraries:", err);
          setError("Failed to initialize required libraries. Please try again. Check your network and API keys.");
        }
      }
    };

    initializeLibraries();
  }, []); // The empty dependency array ensures this effect runs only once on component mount

  // --- PDF File Upload Handler ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return; // Exit if no file is selected

    setLoading(true); // Indicate loading
    setError(""); // Clear previous errors
    setBookDetails(""); // Clear previous book details
    setCopied(false); // Reset copied status

    try {
      const textContent = await extractTextFromPDF(file);
      await analyzeTextForBooks(textContent);
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError("Failed to process PDF. Please try a different file, or ensure it's not corrupted.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // --- PDF Text Extraction Logic ---
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Ensure PDF.js library is loaded before proceeding
    if (!pdfjsLib) {
      throw new Error("PDF library not loaded. Please try again or refresh the page.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          // Convert ArrayBuffer to Uint8Array for PDF.js
          const pdfData = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let textContent = "";

          // Process only the first 3 pages to limit resource usage and speed up analysis
          const pagesToExtract = Math.min(pdf.numPages, 3);

          for (let i = 1; i <= pagesToExtract; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();

            // Define interfaces for type safety when working with text content
            interface PDFTextItem {
              str: string; // The actual text string
              [key: string]: any; // Allow other properties
            }

            interface PDFTextContent {
              items: PDFTextItem[]; // Array of text items
              [key: string]: any; // Allow other properties
            }

            // Extract 'str' property from each item and join them into a single string
            textContent += (text as PDFTextContent).items
              .map((item: PDFTextItem) => ("str" in item ? item.str : ""))
              .join(" ");
            textContent += "\n\n"; // Add newlines between pages for readability
          }

          resolve(textContent); // Resolve the promise with the extracted text
        } catch (error) {
          console.error("Error during PDF text extraction:", error);
          reject(new Error("Could not extract text from PDF. The file might be unreadable or corrupted."));
        }
        
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(new Error("Failed to read the PDF file."));
      };

      reader.readAsArrayBuffer(file); // Start reading the file
    });
  };

  // --- AI Text Analysis Logic ---
  const analyzeTextForBooks = async (text: string) => {
    // Ensure Groq client is initialized before making API calls
    if (!groqClient) {
      throw new Error("AI client not initialized. Please refresh the page.");
    }

    try {
      // Truncate text if it's too long to avoid API limits and improve performance
      // Groq's context window for llama3-70b-8192 is 8192 tokens.
      // 4000 characters is a safe approximation (roughly 1.5 chars per token for English).
      const truncatedText = text.length > 4000 ? text.substring(0, 4000) + "..." : text;

      const response = await groqClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a book detection assistant. Analyze the provided text and identify any mentioned books. For each book found, provide the following information:\n\n- Book Name: [Book's Name]\n- Author: [Author's Name]\n- Description: [A concise description of the book (up to 1000 words)] Cover main themes, key ideas, and why it's significant.Use clear paragraphs. Do not use asterisks (*) or other special symbols for formatting (like bolding).",
          },
          {
            role: "user",
            content: `Please analyze this text and identify any books mentioned:\n\n${truncatedText}`
          }
        ],
        model: "llama3-70b-8192", // Specify the AI model to use
        max_tokens: 2000, // Limit the response length from the AI
        temperature: 0.3, // Control creativity (lower is more deterministic)
      });

      // Set the book details from the AI's response, or a default message
      setBookDetails(response.choices[0]?.message?.content || "No books found in the document.");
    } catch (error) {
      console.error("Error analyzing text with AI:", error);
      setError("Failed to analyze document for books using AI. Please check your API key or try again.");
      setBookDetails(""); // Clear any partial results
    }
  };

  // --- Clipboard Functionality ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookDetails)
      .then(() => {
        setCopied(true); // Set copied state to true
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError("Failed to copy text to clipboard."); // Inform user of copy error
      });
  };

  // --- Component Render ---
  return (
    <div className={styles.container}>
      <h1>PDF Book Finder</h1>
      <p>Upload a PDF document to identify and summarize any mentioned books.</p>

      <div className={styles.uploadSection}>
        <input
          type="file"
          accept="application/pdf" // Only allow PDF files
          onChange={handleFileUpload}
          disabled={loading} // Disable input while processing
        />
        {loading && <p>Analyzing document for books... Please wait.</p>}
        {error && <p className={styles.error}>{error}</p>} {/* Display errors */}
      </div>

      {bookDetails && ( // Only show this section if bookDetails are available
        <div className={styles.bookSection}>
          <div className={styles.sectionHeader}>
            <h3>Summarized Books:</h3>
          </div>
          <div className={styles.bookDetails}>
            {/* Split AI response by newlines and render each as a paragraph */}
            {bookDetails.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button
            onClick={copyToClipboard}
            className={styles.copyButton}
            disabled={copied} // Disable button briefly after copying
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      )}
    </div>
  );
}