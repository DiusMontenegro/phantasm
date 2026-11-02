"use client";

import { FormEvent, useState } from "react";
import { ChevronDown, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { OPENROUTER_MODELS } from "@/lib/openrouter-models";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type ChatModelId = (typeof OPENROUTER_MODELS)[number]["id"];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [model, setModel] = useState<ChatModelId>(OPENROUTER_MODELS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
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

  function clearConversation() {
    setMessages([]);
    setError("");
  }

  return (
    <>
      {!isOpen && (
        <button
          className="ai-chat-launcher"
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {isOpen && (
        <section className="ai-chat-panel" aria-label="AI chat">
          <header className="ai-chat-header">
            <div>
              <span className="ai-chat-status" aria-hidden="true" />
              <div>
                <strong>AI Chat</strong>
                <small>Questions and answers</small>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close AI chat">
              <X size={18} />
            </button>
          </header>

          <div className="ai-chat-model-row">
            <Sparkles size={15} />
            <label htmlFor="ai-chat-model">Model</label>
            <div className="ai-chat-model-select">
              <select
                id="ai-chat-model"
                value={model}
                disabled={isStreaming}
                onChange={(event) => {
                  const selectedModel = OPENROUTER_MODELS.find(
                    (option) => option.id === event.target.value,
                  );
                  if (selectedModel) setModel(selectedModel.id);
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
            {messages.length > 0 && (
              <button
                className="ai-chat-clear"
                type="button"
                onClick={clearConversation}
                disabled={isStreaming}
                aria-label="Clear conversation"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="ai-chat-empty">
                <Sparkles size={22} />
                <strong>Ask anything</strong>
                <p>Get direct answers to general questions.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  className={`ai-chat-message ai-chat-message-${message.role}`}
                  key={message.id}
                >
                  {message.content ||
                    (message.role === "assistant" && isStreaming ? (
                      <span className="ai-chat-thinking">Thinking...</span>
                    ) : null)}
                </div>
              ))
            )}
            {error && (
              <div className="ai-chat-error" role="alert">
                {error}
              </div>
            )}
          </div>

          <form className="ai-chat-form" onSubmit={submitQuestion}>
            <label className="sr-only" htmlFor="ai-chat-input">
              Ask a question
            </label>
            <textarea
              id="ai-chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question..."
              rows={1}
              maxLength={4000}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button type="submit" disabled={!input.trim() || isStreaming} aria-label="Send question">
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
