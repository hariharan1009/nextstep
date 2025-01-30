"use client";

import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  userId: string;
  onClearChat: () => void;
  onDeleteChat: (id: string) => void;
  history: ChatHistoryEntry[];
}

interface ChatHistoryEntry {
  id: string;
  query: string;
  response: string;
  createdAt: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  userId,
  onClearChat,
  onDeleteChat,
  history,
}) => {
  return (
    <div className={styles.sidebar}>
      <h2>Chat History</h2>
      <button onClick={onClearChat} className={styles.clearButton}>
        Clear All Chats
      </button>
      <div className={styles.historyList}>
        {history.map((entry) => (
          <div key={entry.id} className={styles.historyItem}>
            <p>
              <strong>Q:</strong> {entry.query}
            </p>
            <p>
              <strong>A:</strong> {entry.response}
            </p>
            <button
              onClick={() => onDeleteChat(entry.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
