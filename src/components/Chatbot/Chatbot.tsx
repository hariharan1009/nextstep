'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  id: string;
};

export default function CareerAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim() || isLoading) return;

  const userMessage: Message = {
    role: 'user',
    content: input,
    id: Date.now().toString(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  setError(null);

  try {
    const apiUrl = '/api/chat';
    console.log('Making request to:', apiUrl); // Debugging
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          ...messages.map(msg => ({ 
            role: msg.role, 
            content: msg.content 
          })),
          { role: 'user', content: input },
        ],
      }),
      signal: AbortSignal.timeout(15000) // 15s timeout
    });

    // Debug response
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Raw response:', responseText.substring(0, 200));

    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(
        responseText.includes('<!DOCTYPE html>') 
          ? 'Server returned HTML instead of JSON. Check API endpoint.'
          : `Unexpected response: ${responseText.substring(0, 100)}`
      );
    }

    const data = JSON.parse(responseText);

    if (!response.ok) {
      throw new Error(data.error || `Request failed (${response.status})`);
    }

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: data.content,
      id: Date.now().toString(),
    }]);

  } catch (error) {
    console.error('Request failed:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Network request failed';
    
    setError(errorMessage);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "I'm having trouble connecting. Please try again in a moment.",
      id: Date.now().toString(),
    }]);

  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h2>Career Advisor</h2>
        <p>Get expert advice on your career questions</p>
      </div>
      
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <p>Hello! I'm your career advisor. How can I help today?</p>
            <div className={styles.suggestions}>
              <p>Try asking:</p>
              <ul>
                <li>"How can I improve my resume?"</li>
                <li>"What careers match my skills?"</li>
                <li>"Tips for a successful interview"</li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' 
                  ? styles.userMessage 
                  : styles.assistantMessage
              }`}
            >
              <div className={styles.messageContent}>
                {message.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button 
            onClick={() => setError(null)}
            className={styles.errorDismiss}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ask your career question..."
          disabled={isLoading}
          className={styles.inputField}
          aria-label="Type your message"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={styles.sendButton}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className={styles.spinner} aria-hidden="true"></span>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
}