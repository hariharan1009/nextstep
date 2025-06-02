"use client";

import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import styles from "./Chat.module.css";
import { Send } from "lucide-react";

interface ChatProps {
  initialMessage?: string;
  userDetails: {
    id: string;
    fullName: string;
    profile: {
      skills: { name: string }[];
      experience: {
        title: string;
        company: string;
        startDate: string;
        endDate?: string;
        description?: string;
      }[];
    };
  };
  onNewChat: () => void; // Add this prop
}

interface ChatHistoryEntry {
  message: string;
  response: string;
}

export default function Chat({
  initialMessage = "",
  userDetails,
  onNewChat,
}: ChatProps) {
  const [message, setMessage] = useState(initialMessage);
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const chatCompletion = await getGroqChatCompletion(message);
    const newResponse = chatCompletion.choices[0]?.message?.content || "";
    setResponse(newResponse);
    setHistory([{ message, response: newResponse }, ...history]);
    setMessage("");

    // Save the chat message to the database
    await fetch("/api/chat/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userDetails.id,
        query: message,
        response: newResponse,
      }),
    });

    // Trigger the sidebar to refresh
    onNewChat();
  }

  async function getGroqChatCompletion(userMessage: string) {
    const userSkills = userDetails.profile.skills
      .map((skill) => skill.name)
      .join(", ");
    const userExperience = userDetails.profile.experience
      .map((exp) => `${exp.title} at ${exp.company}`)
      .join("; ");

    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career advisor bot. you help people with their career questions. Keep replies brief and informative. Don't use Markdown or HTML. Be friendly and professional.",
        },
        {
          role: "user",
          content: `User Details: Name: ${userDetails.fullName}, Skills: ${userSkills}, Experience: ${userExperience}. Message: ${userMessage}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
  }

  return (
    <div className={styles.chatContainer}>
      <h1>Get your Career Guidance here!</h1>
      <div className={styles.history}>
        {history.map((entry, index) => (
          <div key={index} className={styles.message}>
            <p>
              <strong>You:</strong> {entry.message}
            </p>
            <p>
              <strong>Bot:</strong> {entry.response}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.chatInput}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Questions about career? Ask me!"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          <Send />
        </button>
      </form>
    </div>
  );
}
