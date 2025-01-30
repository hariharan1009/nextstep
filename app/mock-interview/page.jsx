"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create a Room</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        className={styles.input}
        onChange={(e) => setRoomId(e.target.value)}
        value={roomId}
      />
      <Link href={`/room/${roomId}`}>
        <button className={styles.button}>Join Room</button>
      </Link>
    </div>
  );
}
