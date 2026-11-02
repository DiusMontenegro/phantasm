"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ChevronDown, Send, Sparkles } from "lucide-react";
import { OPENROUTER_MODELS } from "@/lib/openrouter-models";

interface SearchVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  videos?: SearchVideo[];
  query?: string;
}

type ChatModelId = (typeof OPENROUTER_MODELS)[number]["id"];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AiChatWorkspace() {
  const [model, setModel] = useState<ChatModelId>(OPENROUTER_MODELS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    messageList.scrollTop = messageList.scrollHeight;
  }, [messages, isStreaming]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isStreaming) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: prompt,
    };
    const assistantMessage: ChatMessage = {
      id: createMessageId(),
      role: "assistant",
      content: "",
    };
    const nextMessages = [...messages, userMessage];
    const requestMessages = nextMessages.map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages([...nextMessages, assistantMessage]);
    setInput("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages, model }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "The AI request failed.");
      }

      if (response.headers.get("content-type")?.includes("application/json")) {
        const body = (await response.json()) as {
          message?: string;
          query?: string;
          videos?: SearchVideo[];
        };
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? {
                  ...message,
                  content: body.message || "Here are the videos I found.",
                  query: body.query,
                  videos: body.videos || [],
                }
              : message,
          ),
        );
        return;
      }

      if (!response.body) throw new Error("The AI returned an empty response.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete the AI request.",
      );
      setMessages((current) =>
        current.filter((message) => message.id !== assistantMessage.id),
      );
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <main className="chat-page">
      <section className="chat-conversation" aria-label="AI chat conversation">
        <header className="chat-conversation-header">
          <strong>PHANTASM AI</strong>
          <div className="chat-model-select">
            <select
              aria-label="AI model"
              value={model}
              disabled={isStreaming}
              onChange={(event) => {
                const selected = OPENROUTER_MODELS.find(
                  (option) => option.id === event.target.value,
                );
                if (selected) setModel(selected.id);
              }}
            >
              {OPENROUTER_MODELS.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </div>
        </header>

        <div
          ref={messageListRef}
          className="chat-message-list"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <span className="chat-welcome-icon">
                <Sparkles size={24} />
              </span>
              <h1>How can I help?</h1>
              <p>Ask a question or describe the videos you want to find.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                className={`chat-message chat-message-${message.role}`}
                key={message.id}
              >
                {message.role === "assistant" && (
                  <span className="chat-message-avatar" aria-hidden="true">
                    P
                  </span>
                )}
                <div className="chat-message-content">
                  {message.content ||
                    (message.role === "assistant" && isStreaming
                      ? "Thinking..."
                      : null)}
                  {message.videos && message.videos.length > 0 && (
                    <div className="chat-search-results">
                      <small>Results for &ldquo;{message.query}&rdquo;</small>
                      {message.videos.map((video) => (
                        <Link
                          className="chat-search-result"
                          href={`/dashboard/watch/${encodeURIComponent(video.id)}`}
                          key={video.id}
                        >
                          <span className="chat-search-thumbnail">
                            {video.thumbnailUrl ? (
                              <Image
                                src={video.thumbnailUrl}
                                alt=""
                                fill
                                sizes="120px"
                              />
                            ) : null}
                          </span>
                          <span>
                            <strong>{video.title || "Untitled video"}</strong>
                            <small>{video.channelTitle || "Unknown channel"}</small>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {error && (
                    <div className="chat-error" role="alert">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="chat-composer" onSubmit={submitMessage}>
          <label className="sr-only" htmlFor="chat-workspace-input">
            Message PHANTASM AI
          </label>
          <textarea
            id="chat-workspace-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message PHANTASM"
            rows={1}
            maxLength={4000}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button type="submit" disabled={!input.trim() || isStreaming} aria-label="Send message">
            <Send size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
