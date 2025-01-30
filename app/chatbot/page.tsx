"use client";

import React, { useEffect, useState } from "react";
import Chat from "../components/Chat/Chat";
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";

const ChatbotPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message") || "";

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to access the chatbot.");
        router.push("/login");
        return;
      }

      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user details.");
      }

      setUserDetails(data.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const fetchHistory = async () => {
    if (userDetails) {
      const response = await fetch(
        `/api/chat/history?userId=${userDetails.id}`
      );
      const data = await response.json();
      setHistory(data);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [router]);

  useEffect(() => {
    fetchHistory();
  }, [userDetails]);

  const handleClearChat = async () => {
    await fetch("/api/chat/clear", { method: "POST" });
    fetchHistory();
  };

  const handleDeleteChat = async (id: string) => {
    await fetch(`/api/chat/delete/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  const refreshSidebar = async () => {
    fetchHistory();
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <Sidebar
          userId={userDetails.id}
          onClearChat={handleClearChat}
          onDeleteChat={handleDeleteChat}
          history={history}
        />
        <Chat
          initialMessage={initialMessage}
          userDetails={userDetails}
          onNewChat={refreshSidebar}
        />
      </div>
    </>
  );
};

export default ChatbotPage;
