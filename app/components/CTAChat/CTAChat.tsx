"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CTAChat.module.css";
import { CircleArrowOutUpRight, Search } from "lucide-react";

const CTAChat = () => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      router.push(`/chatbot?message=${encodeURIComponent(message)}`);
    }
  };

  return (
    <form className={styles.chatInput} onSubmit={handleSubmit}>
      <div className={styles.iconContainer}>
        <Search className={styles.icon} />
      </div>
      <input
        type="text"
        placeholder="Plan your career now..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className={styles.sendButton}>
        <CircleArrowOutUpRight />
      </button>
    </form>
  );
};

export default CTAChat;
