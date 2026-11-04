import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const CHATLING_IFRAME_ID = "chtl-chat-iframe";
// Create this exact variable in Chatling's Builder. The opening AI block uses it
// to answer the message submitted from this site.
const INITIAL_QUERY_VARIABLE = "initial_query";

export default function SafariChatTrigger() {
  const [value, setValue] = useState("");
  const [isChatReady, setIsChatReady] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const pendingQuestionRef = useRef<string | null>(null);

  useEffect(() => {
    const syncChatlingState = () => {
      const chatling = window.Chatling;
      const ready = Boolean(chatling);

      setIsChatReady(ready);

      if (ready) {
        chatling?.hideChatIcon?.();
      }

      const iframe = document.getElementById(CHATLING_IFRAME_ID);
      const iframeStyle = iframe ? window.getComputedStyle(iframe) : null;
      const iframeIsOpen =
        Boolean(iframe) &&
        iframeStyle?.display !== "none" &&
        iframeStyle?.zIndex !== "-1" &&
        iframeStyle?.transform !== "matrix(0, 0, 0, 0, 0, 0)";

      setIsChatOpen(iframeIsOpen);

      if (ready && pendingQuestionRef.current) {
        const pendingQuestion = pendingQuestionRef.current;
        pendingQuestionRef.current = null;
        openChatling(pendingQuestion);
      }
    };

    const handleChatlingMessage = (event: MessageEvent) => {
      const eventId = getChatlingEventId(event.data);

      if (eventId === "chtl_chat_widget_opened") {
        setIsChatOpen(true);
      }

      if (eventId === "chtl_chat_minimized" || eventId === "chtl_chat_widget_closed") {
        setIsChatOpen(false);
      }
    };

    window.addEventListener("message", handleChatlingMessage);
    syncChatlingState();

    const interval = window.setInterval(syncChatlingState, 500);

    return () => {
      window.removeEventListener("message", handleChatlingMessage);
      window.clearInterval(interval);
    };
  }, []);

  const openChatling = (question: string) => {
    const chatling = window.Chatling;

    if (!chatling) {
      pendingQuestionRef.current = question;
      return;
    }

    setIsSending(true);

    const openWidget = () => {
      chatling.open();
      setIsChatOpen(true);
      setIsSending(false);
      setValue("");
    };

    const variables = createChatlingVariables(question);

    if (chatling.setVariables) {
      chatling.setVariables(variables, (success) => {
        // Open even if Chatling is temporarily unavailable: the visitor still
        // gets a usable chat instead of a dead send button.
        if (!success) {
          console.warn("Safari chat could not save the opening question.");
        }
        openWidget();
      });
      return;
    }

    openWidget();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = value.trim();

    if (!question || isSending) {
      return;
    }

    openChatling(question);
  };

  if (isChatOpen) {
    return null;
  }

return (
    <div className="fixed bottom-3 left-1/2 z-[99990] w-[90%] max-w-[320px] -translate-x-1/2 sm:bottom-4 sm:max-w-md">
      <div className="relative rounded-full" style={{ padding: "2px" }}>
        {/* Ambient halo — soft, slow breathing glow behind the whole pill */}
        <div
          className="safari-chat-halo pointer-events-none absolute -inset-5 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.35), rgba(249,115,22,0.12) 45%, transparent 72%)",
            filter: "blur(14px)",
          }}
          aria-hidden="true"
        />

        {/* Rotating light sweep along the border */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden="true">
          <div
            className="safari-chat-orbital absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(249,115,22,0) 60deg, rgba(249,115,22,0.85) 88deg, rgba(255,237,213,0.95) 90deg, rgba(249,115,22,0.85) 92deg, rgba(249,115,22,0) 120deg, transparent 180deg, transparent 360deg)",
              filter: "blur(1.5px)",
            }}
          />
          <div
            className="safari-chat-orbital absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, transparent 0deg, rgba(249,115,22,0) 60deg, rgba(249,115,22,0.45) 88deg, rgba(255,237,213,0.55) 90deg, rgba(249,115,22,0.45) 92deg, rgba(249,115,22,0) 120deg, transparent 180deg, transparent 360deg)",
              animationDelay: "-4s",
            }}
          />
        </div>

        {/* Inner pulse — tight glow right at the border edge */}
        <div
          className="safari-chat-pulse pointer-events-none absolute -inset-1 rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(249,115,22,0.3), transparent 70%)",
            filter: "blur(6px)",
          }}
          aria-hidden="true"
        />

        <style>{`
          .safari-chat-orbital {
            animation: safari-chat-orbital 8s linear infinite;
          }
          .safari-chat-halo {
            animation: safari-chat-halo 5s ease-in-out infinite;
          }
          .safari-chat-pulse {
            animation: safari-chat-pulse 5s ease-in-out infinite;
            animation-delay: -1.5s;
          }
          @keyframes safari-chat-orbital {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes safari-chat-halo {
            0%, 100% { opacity: 0.5; transform: scale(0.94); }
            50% { opacity: 0.9; transform: scale(1.06); }
          }
          @keyframes safari-chat-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.85; transform: scale(1.05); }
          }
          @media (prefers-reduced-motion: reduce) {
            .safari-chat-orbital,
            .safari-chat-halo,
            .safari-chat-pulse {
              animation: none;
            }
          }
        `}</style>

        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 rounded-full border border-orange-500 bg-slate-900/90 py-2 pl-3 pr-1 backdrop-blur-md sm:py-2.5 sm:pl-4 sm:pr-2"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-orange-500 sm:h-9 sm:w-9">
            <LionIcon className="h-5 w-5 text-orange-500 sm:h-6 sm:w-6" />
            <span className="absolute -bottom-1.5 left-1.5 h-2 w-2 rotate-[-45deg] border-b-2 border-l-2 border-orange-500 bg-slate-900" />
          </div>

          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={isChatReady ? "Ask Karla AI anything..." : "Loading safari chat..."}
            disabled={!isChatReady || isSending}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none sm:text-base"
          />

          <button
            type="submit"
            aria-label="Open safari assistant"
            disabled={!isChatReady || isSending || !value.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 sm:h-11 sm:w-11"
          >
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function createChatlingVariables(question: string) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return {};
  }

  return { [INITIAL_QUERY_VARIABLE]: trimmedQuestion };
}

function getChatlingEventId(data: unknown) {
  if (typeof data === "string") {
    return data;
  }

  if (!data || typeof data !== "object" || !("event_id" in data)) {
    return null;
  }

  const eventId = (data as { event_id?: unknown }).event_id;
  return typeof eventId === "string" ? eventId : null;
}

function LionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="18" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="27" cy="14" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13" cy="24" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="18.5" cy="16.5" r="1.1" fill="currentColor" />
      <path d="M20 19c1 1.4 3 1.4 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M17 24c-3 1-5 4-5 7 0 3 2 5 5 5h14c3 0 5-2 5-5 0-2-1-4-3-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 36v4M25 36v4M31 33l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M36 30c3-1 5 1 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="40.2" cy="34.4" r="1.3" fill="currentColor" />
    </svg>
  );
}

declare global {
  interface Window {
    Chatling?: {
      open: () => void;
      minimize?: () => void;
      hideChatIcon?: () => void;
      showChatIcon?: () => void;
      setVariables?: (
        vars: Record<string, unknown>,
        callback?: (success: boolean, errorMessage?: string) => void
      ) => void;
    };
  }
}
